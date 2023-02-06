import axios from 'axios';
import debug from 'debug';

const logger = debug('hmc-view:rtc');

const audioConstraints = {
    // channelCount: { asking for stereo gets us in to trouble - even thoug say an iPhone has three mics, its presented to us a mono. On my mac, a stereo mic is the 'Microsoft Virtual Device" which does not work.
    //   ideal: 2,
    //    min: 1,
    // },
    sampleRate: {
        ideal: 48000,
        //  min: 44100,
    },
};

const videoConstraints = {
    width: { min: 640, ideal: 1280, max: 1600 },
    height: { min: 360, ideal: 720 },
    //aspectRatio: 1.777777778,
    frameRate: { max: 30 },
    facingMode: { ideal: 'user' },
};

const makeUserMediaOptions = ({ useVideo, deviceId } = {}) => ({
    audio: {
        ...audioConstraints,
        latency: 0,
        sampleSize: 16,
        deviceId,
        // echoCancellation: false,
        // noiseSuppression: false,
    },
    video: useVideo ? videoConstraints : false,
});

const candidateMatchRules = [/built[- ]?in/i, /microphone/i];

const _AudioContext =
    typeof window !== 'undefined' &&
    (window.AudioContext || window.webkitAudioContext);

const findPrimaryAudioDeviceCandidate = async () => {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    for (const matchRule of candidateMatchRules) {
        for (const media of mediaDevices) {
            if (media.kind !== 'audioinput') {
                continue;
            }
            if (matchRule.test(media.label)) {
                return media;
            }
        }
    }
    return null;
};

export const getUserMicrophoneMediaStream = (options) => {
    return navigator.mediaDevices.getUserMedia(makeUserMediaOptions(options));
};

// TODO
// issue: using built-in mic causes audio output to speakers
// expected: input from mic, output headphones
// purpose: headphones using bluetooth revert to mono upon opening
//          the input stream due to bluetooth limitations
export const getPreferredMicrophoneMediaStream = async ({ useVideo }) => {
    let microphoneStream;
    try {
        microphoneStream = await getUserMicrophoneMediaStream({ useVideo });
    } catch (err) {
        console.error('Error occurred trying to get microphone stream:', err);
        return null;
    }

    const primaryDeviceCandidate = await findPrimaryAudioDeviceCandidate();
    const audioDeviceIds = microphoneStream
        .getAudioTracks()
        .map((track) => track.getSettings().deviceId);

    if (
        !primaryDeviceCandidate ||
        audioDeviceIds.includes(primaryDeviceCandidate.deviceId)
    ) {
        return microphoneStream;
    }

    closeMediaStream(microphoneStream);
    try {
        return await getUserMicrophoneMediaStream({
            useVideo,
            deviceId: primaryDeviceCandidate.deviceId,
        });
    } catch (err) {
        try {
            return await getUserMicrophoneMediaStream({ useVideo });
        } catch (err2) {
            return null;
        }
    }
};

// export const getUserMicrophoneWithGainMediaStream = async () => {
//     const audioContext = new _AudioContext();
//     const mediaStream = await getUserMicrophoneMediaStream();
//     const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
//     const gainNode = audioContext.createGain();
//     const mediaStreamDestination = audioContext.createMediaStreamDestination();
//     mediaStreamSource.connect(gainNode);
//     gainNode.connect(mediaStreamDestination);
//     return [mediaStream, mediaStreamDestination.stream];
// };

export const getServerConnectionSettings = async (iceUrl) => {
    const response = await axios.post(iceUrl);
    switch (response.status) {
        case 200:
            return response.data;
        default:
            throw new Error('Too busy. Please try again later');
    }
};

export const getRtcPeerConnection = async (iceUrl, options) => {
    const peerConnectionSettings = await getServerConnectionSettings(iceUrl);
    const peerConnection = new RTCPeerConnection(peerConnectionSettings);

    if (options.onConnectionStateChange) {
        peerConnection.oniceconnectionstatechange = () => {
            switch (peerConnection.iceConnectionState) {
                case 'new':
                case 'checking':
                case 'completed':
                    break;
                case 'connected':
                    options.onConnectionStateChange('connected');
                    break;
                case 'failed':
                case 'disconnected':
                case 'closed':
                    options.onConnectionStateChange('disconnected');
            }
        };
    }
    if (options.onServerTrack) {
        peerConnection.ontrack = (evt) => {
            logger('server responded with track', evt.track);
            options.onServerTrack(evt.track);
        };
    }

    return peerConnection;
};

export const sendRtcConnectionOffer = async (peerConnection, connectionUrl) => {
    logger('making local description');
    const localDescription = await peerConnection.createOffer({
        offerToReceieveAudio: true,
    });

    // sdp munging to force stereo stream
    // https://stackoverflow.com/questions/33649283/how-to-set-up-sdp-for-high-quality-opus-audio
    localDescription.sdp = localDescription.sdp.replace(
        'useinbandfec=1',
        'useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=96000', // As of Oct 31 2022 'useinbandfec=1;stereo=1;sprop-stereo=1',
    );
    await peerConnection.setLocalDescription(localDescription);

    // logger('waiting for end-of-candidate response');
    // await new Promise(
    //     (resolve) =>
    //         (peerConnection.onicecandidate = (evt) =>
    //             evt.candidate === null && resolve()),
    // );

    logger('sending offer to server');
    const base64Offer = btoa(JSON.stringify(peerConnection.localDescription));
    const response = await axios.post(
        connectionUrl,
        JSON.stringify({ LocalDescription: base64Offer }),
    );
    if (response.status !== 200) throw new Error('Server seems busy');

    logger('offer accepted');
    const remoteDescription = new RTCSessionDescription(
        JSON.parse(atob(response.data.LocalDescription)),
    );
    peerConnection.setRemoteDescription(remoteDescription);
};

export const addMediaStreamToConnection = (peerConnection, mediaStream) => {
    for (const track of mediaStream.getTracks()) {
        logger('adding track to peer connection:', track);
        peerConnection.addTrack(track, mediaStream);
    }
};

export const closeMediaStream = (mediaStream) => {
    for (const track of mediaStream.getTracks()) {
        logger('stopping track:', track);
        track.stop();
    }
};

export const replaceUserMediaStream = (peerConnection, mediaStream) => {
    const [sender] = peerConnection.getSenders();
    const [track] = mediaStream.getTracks();
    sender.replaceTrack(track);
};

export const makeBlankMediaStream = () => {
    const context = new _AudioContext();
    const oscillatorNode = context.createOscillator();
    const mediaStreamDestination = context.createMediaStreamDestination();
    oscillatorNode.connect(mediaStreamDestination);
    return mediaStreamDestination.stream;
};

export const connectWithBlankMedia = async (connectionUrl, iceUrl, options) => {
    const peerConnection = await getRtcPeerConnection(iceUrl, options);
    const mediaStream = makeBlankMediaStream();
    addMediaStreamToConnection(peerConnection, mediaStream);
    await sendRtcConnectionOffer(peerConnection, connectionUrl);
    return [peerConnection, mediaStream];
};

export const connectWithUserMedia = async (connectionUrl, iceUrl, options) => {
    const peerConnection = await getRtcPeerConnection(iceUrl, options);
    const userMediaStream = await getUserMicrophoneMediaStream();
    addMediaStreamToConnection(peerConnection, userMediaStream);
    await sendRtcConnectionOffer(peerConnection, connectionUrl);
    return [peerConnection, userMediaStream];
};

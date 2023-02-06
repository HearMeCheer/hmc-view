import AuthParticipant from './AuthParticipant';
import PubSub from './PubSub';
import {
    closeMediaStream,
    getPreferredMicrophoneMediaStream,
    makeBlankMediaStream,
} from './rtc';

const LocalStream = {
    mediaStream: null,
    // audioTrack: null,
    audioEnabled: true,
    // videoTrack: null,
    videoEnabled: true,
    usingMicrophone: false,

    onStateChange(callback) {
        return PubSub.subscribe('LocalStream.stateChange', callback);
    },

    publishChange({ type, payload }) {
        PubSub.publish('LocalStream.stateChange', { type, payload });
    },

    async make() {
        const mediaStream = await getPreferredMicrophoneMediaStream({
            useVideo: AuthParticipant.current?.canSendVideo,
        });
        const usingMicrophone = mediaStream !== null;
        this.setMediaStream(
            usingMicrophone ? mediaStream : makeBlankMediaStream(),
        );
        this.setUsingMicrophone(usingMicrophone);
    },

    switchToBlankStream() {
        this.setMediaStream(makeBlankMediaStream());
        this.setUsingMicrophone(false);
    },

    async switchToMicrophone() {
        if (this.usingMicrophone) {
            console.warn(
                'Ignored call LocalStream.useMicrophone() while LocalStream.usingMicrophone is true',
            );
            return;
        }

        const mediaStream = await getPreferredMicrophoneMediaStream({
            useVideo: AuthParticipant.current?.canSendVideo,
        });
        const usingMicrophone = mediaStream !== null;
        if (!usingMicrophone) return;

        this.setMediaStream(mediaStream);
        this.setUsingMicrophone(usingMicrophone);
    },

    setMediaStream(mediaStream) {
        if (this.mediaStream) {
            closeMediaStream(this.mediaStream);
        }
        this.mediaStream = mediaStream;
        this.publishChange({ type: 'mediaStream', payload: mediaStream });
        for (const track of this.mediaStream.getTracks()) {
            track.onended = () => this.switchToBlankStream();
        }
    },

    getMediaStream() {
        return this.mediaStream;
    },

    setAudioEnabled(enabled) {
        this.audioEnabled = enabled;
        if (this.mediaStream) {
            for (const track of this.mediaStream.getAudioTracks()) {
                track.enabled = this.audioEnabled;
            }
        }
        this.publishChange({ type: 'audioEnabled', payload: enabled });
    },

    setVideoEnabled(enabled) {
        this.videoEnabled = enabled;
        if (this.mediaStream) {
            for (const track of this.mediaStream.getVideoTracks()) {
                track.enabled = this.audioEnabled;
            }
        }
        this.publishChange({ type: 'videoEnabled', payload: enabled });
    },

    setUsingMicrophone(enabled) {
        this.usingMicrophone = enabled;
        this.publishChange({ type: 'usingMicrophone', payload: enabled });
    },

    close() {
        if (this.mediaStream) {
            closeMediaStream(this.mediaStream);
        }

        this.mediaStream = null;
        this.audioEnabled = true;
        this.videoTrack = null;
        this.usingMicrophone = false;

        this.publishChange({ type: 'reset' });
    },
};

export default LocalStream;

import debug from 'debug';

import LocalStream from './LocalStream';
import MessageChannel from './MessageChannel';
import PubSub from './PubSub';
import ServerStream from './ServerStream';
import {
    addMediaStreamToConnection,
    getRtcPeerConnection,
    replaceUserMediaStream,
    sendRtcConnectionOffer,
} from './rtc';

const logger = debug('hmc-view:RtcConnection');

const RtcConnection = {
    connectionUrl: undefined,
    iceUrl: undefined,

    connectionStarted: false,
    connectionState: 'disconnected',

    peerConnection: undefined,
    connectionSettings: undefined,

    publishStateChange({ type, payload }) {
        PubSub.publish('RtcConnection.stateChange', { type, payload });
    },

    onStateChange(callback) {
        return PubSub.subscribe('RtcConnection.stateChange', callback);
    },

    // async makeConnectionSettings() {
    //     const response = await axios.post(this.iceUrl);
    //     switch (response.status) {
    //         case 200:
    //             this.connectionSettings = response.data;
    //             break;
    //         default:
    //             throw new Error('Too busy. Please try again later');
    //     }
    // },

    // makePeerConnection() {
    //     this.peerConnection = new RTCPeerConnection(this.connectionSettings);
    //     this.peerConnection.oniceconnectionstatechange = () => {
    //         switch (this.peerConnection.iceConnectionState) {
    //             case 'new':
    //             case 'checking':
    //             case 'completed':
    //                 break;
    //             case 'connected':
    //                 this.setConnectionState('connected');
    //                 break;
    //             case 'failed':
    //             case 'disconnected':
    //             case 'closed':
    //                 this.setConnectionState('disconnected');
    //         }
    //     };
    //     this.peerConnection.ontrack = (evt) => {
    //         logger('server responded with track', evt.track);
    //         ServerStream.addTrack(evt.track);
    //     };

    //     const mediaStream = LocalStream.makeMediaStream();
    //     for (const track of mediaStream.getTracks()) {
    //         logger('Adding track to offer', track);
    //         this.peerConnection.addTrack(track, mediaStream);
    //     }
    // },

    // Really what worked is the server sending out RTCP messages:
    // peerConnection.WriteRTCP([]rtcp.Packet{&rtcp.ReceiverEstimatedMaximumBitrate{Bitrate: 1200 * 1000}
    // setVideoBandwidth() {
    //     console.log('setting video bandwith via getSenders()')
    //     const senderList = this.peerConnection.getSenders(); // VIDEO bitrate
    //     console.log(senderList)
    //     senderList.forEach((sender) => {
    //         if (sender.track.kind == 'video') {
    //             const parameters = sender.getParameters();
    //             if (parameters.encodings && parameters.encodings.length > 0) {
    //                 console.log(parameters)
    //                 parameters.encodings[0].maxBitrate = 1000000;
    //                 sender.setParameters(parameters);
    //             }
    //         }
    //     });
    // },

    async connect({
        connectionUrl,
        iceUrl,
        enableMessageChannel = false,
        maxVideoTracks = 0,
    }) {
        logger('connect() called', {
            connectionUrl,
            iceUrl,
            enableMessageChannel,
            maxVideoTracks,
        });
        if (this.connectionStarted) {
            throw new Error(
                'Attempted to open second RtcConnection without closing initial',
            );
        }

        this.connectionStarted = true;
        this.publishStateChange({
            type: 'connectionState',
            payload: 'connecting',
        });
        this.setTargetUrls(connectionUrl, iceUrl);

        if (!this.connectionUrl) throw new Error('Missing connectionUrl');
        if (!this.iceUrl) throw new Error('Missing iceUrl');

        await LocalStream.make();

        // if (this.connectionSettings === undefined) {
        //     logger('making connection settings');
        //     await this.makeConnectionSettings();
        // }
        // if (this.peerConnection === undefined) {
        //     logger('making peer connection');
        //     this.makePeerConnection();
        // }

        this.peerConnection = await getRtcPeerConnection(iceUrl, {
            onServerTrack: (track) => ServerStream.addTrack(track),
            onConnectionStateChange: (state) => this.setConnectionState(state),
        });

        addMediaStreamToConnection(
            this.peerConnection,
            LocalStream.getMediaStream(),
        );

        if (enableMessageChannel) {
            MessageChannel.make(this.peerConnection);
        }

        if (maxVideoTracks > 0) {
            const transceiverCount =
                maxVideoTracks -
                (LocalStream.getMediaStream().getVideoTracks().length > 0
                    ? 1
                    : 0);
            // const transceiverCount = maxVideoTracks;
            for (let i = 0; i < transceiverCount; i++) {
                this.peerConnection.addTransceiver('video', {
                    direction: 'recvonly',
                });
            }
        }

        await sendRtcConnectionOffer(this.peerConnection, connectionUrl);
        logger('finished');
    },

    _disconnect() {
        LocalStream.close();
        ServerStream.close();

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = undefined;
        }
        this.connectionStarted = false;
    },

    disconnect() {
        this.setConnectionState('disconnected');
    },

    updateLocalMediaStream() {
        replaceUserMediaStream(
            this.peerConnection,
            LocalStream.getMediaStream(),
        );
    },

    setConnectionState(nextState) {
        if (nextState === 'disconnected') {
            this._disconnect();
        }
        this.connectionState = nextState;
        this.publishStateChange({
            type: 'connectionState',
            payload: nextState,
        });
    },

    setTargetUrls(connectionUrl, iceUrl) {
        logger('Updated target urls');
        if (connectionUrl) {
            this.connectionUrl = connectionUrl;
        }
        if (iceUrl) {
            this.iceUrl = iceUrl;
        }
    },
};

export default RtcConnection;

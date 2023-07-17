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

    maxRetryAttempts: 3,
    retryAttemptDelay: 5000, // in milliseconds
    lastConnectionParams: {},

    publishStateChange({ type, payload }) {
        PubSub.publish('RtcConnection.stateChange', { type, payload });
    },

    onStateChange(callback) {
        return PubSub.subscribe('RtcConnection.stateChange', callback);
    },

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
        if (this.connectionStarted && this.connectionState !== 'reconnecting') {
            throw new Error(
                'Attempted to open second RtcConnection without closing initial',
            );
        }

        this.lastConnectionParams = {
            connectionUrl,
            iceUrl,
            enableMessageChannel,
            maxVideoTracks,
        };

        this.connectionStarted = true;
        this.publishStateChange({
            type: 'connectionState',
            payload: 'connecting',
        });
        this.setTargetUrls(connectionUrl, iceUrl);

        if (!this.connectionUrl) throw new Error('Missing connectionUrl');
        if (!this.iceUrl) throw new Error('Missing iceUrl');

        await LocalStream.make();

        this.peerConnection = await getRtcPeerConnection(iceUrl, {
            onServerTrack: (track) => ServerStream.addTrack(track),
            onConnectionStateChange:
                this.handleRtcConnectionStateChange.bind(this),
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
        logger('Connection Established');
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

    async attemptReconnection() {
        let retryAttempt = 1;
        let connectionSuccessful = false;
        while (retryAttempt <= this.maxRetryAttempts && !connectionSuccessful) {
            logger(
                'Attempt',
                retryAttempt,
                '- Retrying connection in',
                this.retryAttemptDelay,
                'ms',
            );

            await new Promise((resolve) =>
                setTimeout(() => resolve(), this.retryAttemptDelay),
            );

            try {
                await this.connect(this.lastConnectionParams);
                connectionSuccessful = true;
            } catch (err) {
                logger('Error attempting connection', err);
                retryAttempt += 1;
            }
        }

        if (!connectionSuccessful) {
            logger('Max retry attempts reached. Disconnecting');
            this.shouldAttemptRetry = false;
            this.setConnectionState('disconnected');
        }
    },

    updateLocalMediaStream() {
        replaceUserMediaStream(
            this.peerConnection,
            LocalStream.getMediaStream(),
        );
    },

    setConnectionState(nextState) {
        if (nextState === 'reconnecting') {
            this.attemptReconnection();
        } else if (nextState === 'disconnected') {
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

    handleRtcConnectionStateChange(state) {
        // if the rtc connection drops, start the reconnection process
        if (state === 'disconnected') {
            this.setConnectionState('reconnecting');
        } else {
            this.setConnectionState(state);
        }
    },
};

export default RtcConnection;

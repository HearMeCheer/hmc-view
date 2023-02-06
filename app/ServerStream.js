import debug from 'debug';

import PubSub from './PubSub';
import makeTrackList from './makeTrackList';

const logger = debug('hmc-view:ServerStream');

const ServerStream = {
    audioVolume: 100,
    videoEnabled: true,

    audioTrackList: makeTrackList({
        onChange: (list) => {
            ServerStream.publishChange({
                type: 'audioTrackList',
                payload: list,
            });
        },
    }),

    videoTrackList: makeTrackList({
        onChange: (list) => {
            ServerStream.publishChange({
                type: 'videoTrackList',
                payload: list,
            });
        },
    }),

    onStateChange(callback) {
        return PubSub.subscribe('ServerStream.stateChange', callback);
    },

    publishChange({ type, payload }) {
        PubSub.publish('ServerStream.stateChange', { type, payload });
    },

    addTrack(track) {
        const trackList =
            track.kind === 'video' ? this.videoTrackList : this.audioTrackList;
        const existingTrack = trackList.get(track.id);

        if (existingTrack) {
            logger('track already added');
            return;
        }

        track.onended = () => {
            logger('track ended', track);
            trackList.remove(track);
        };
        // track.onmute = () => {
        //     logger('track muted', track);
        //     this.setAudioVolume(0);
        // };
        // track.onunmute = () => {
        //     logger('track unmuted', track);
        //     this.setAudioVolume(100);
        // };
        trackList.add(track);
    },

    getTracks(kind) {
        if (kind === 'audio') {
            return this.audioTrackList.list();
        } else if (kind === 'video') {
            return this.videoTrackList.list();
        } else {
            return [
                ...this.audioTrackList.list(),
                ...this.videoTrackList.list(),
            ];
        }
    },

    setAudioVolume(volume) {
        this.audioVolume = volume;
        this.publishChange({ type: 'audioVolume', payload: volume });
    },

    setVideoEnabled(enabled) {
        this.videoEnabled = enabled;
        this.publishChange({ type: 'videoEnabled', payload: enabled });
    },

    close() {
        for (const track of this.getTracks()) {
            track.stop();
        }
        this.audioVolume = 100;
        this.videoEnabled = true;
        this.audioTrackList.clear();
        this.videoTrackList.clear();
        this.publishChange({ type: 'reset' });
    },
};

export default ServerStream;

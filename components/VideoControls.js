import React, { useCallback } from 'react';

import { VideocamOutlined as VideoIcon } from '@mui/icons-material';

import LocalStream from '../app/LocalStream';
import { useLocalStream } from '../providers/LocalStreamProvider';
import { useParticipant } from '../providers/ParticipantProvider';
import ControlButton from './ControlButton';

const VideoControls = () => {
    const localStream = useLocalStream();
    const { canSendVideo } = useParticipant();

    const toggleVideo = useCallback(() => {
        LocalStream.setVideoEnabled(!LocalStream.videoEnabled);
    }, []);

    if (!canSendVideo) {
        return null;
    }
    return (
        <div className="HmcVideoControls-root">
            <ControlButton
                inactive={!localStream.videoEnabled}
                onClick={toggleVideo}
                className="HmcVideoControls-button"
            >
                <VideoIcon />
            </ControlButton>
        </div>
    );
};

export default VideoControls;

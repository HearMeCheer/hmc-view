import React, { useCallback } from 'react';

import {
    MicNone as MicNoneIcon,
    MicOffOutlined as MicOffOutlinedIcon,
    MicOutlined as MicOutlinedIcon,
} from '@mui/icons-material';

import LocalStream from '../app/LocalStream';
import RtcConnection from '../app/RtcConnection';
import Snackbar from '../app/Snackbar';
import { useLocalStream } from '../providers/LocalStreamProvider';
import ControlButton from './ControlButton';

const AudioInputControls = () => {
    const { audioEnabled, usingMicrophone } = useLocalStream();

    const toggleMicMuted = useCallback(() => {
        LocalStream.setAudioEnabled(!LocalStream.audioEnabled);
    }, []);

    const useMicrophone = useCallback(async () => {
        await LocalStream.switchToMicrophone();
        if (LocalStream.usingMicrophone) {
            RtcConnection.updateLocalMediaStream();
        } else {
            Snackbar.emitError('No Microphone found or permission was denied');
        }
    }, []);

    return (
        <div className="HmcAudioInputControls-root">
            {!usingMicrophone ? (
                <ControlButton
                    className="HmcAudioInputControls-button"
                    inactive
                    onClick={useMicrophone}
                >
                    <MicNoneIcon />
                </ControlButton>
            ) : (
                <ControlButton
                    className="HmcAudioInputControls-button"
                    inactive={!audioEnabled}
                    onClick={toggleMicMuted}
                >
                    {audioEnabled ? (
                        <MicOutlinedIcon />
                    ) : (
                        <MicOffOutlinedIcon />
                    )}
                </ControlButton>
            )}
        </div>
    );
};

export default AudioInputControls;

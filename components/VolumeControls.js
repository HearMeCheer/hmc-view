import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import {
    VolumeDownOutlined as VolumeDownIcon,
    VolumeMuteOutlined as VolumeMuteIcon,
    VolumeOffOutlined as VolumeOffIcon,
    VolumeUpOutlined as VolumeUpIcon,
} from '@mui/icons-material';

import ServerStream from '../app/ServerStream';
import { useServerStream } from '../providers/ServerStreamProvider';
import ControlButton from './ControlButton';
import Dialog from './Dialog';
import DialogContent from './DialogContent';
import VolumeSlider from './VolumeSlider';

const VolumeIcon = (props) => {
    const { volume } = props;
    if (volume === 0) {
        return <VolumeOffIcon />;
    }
    if (volume < 15) {
        return <VolumeMuteIcon />;
    }
    if (volume < 50) {
        return <VolumeDownIcon />;
    }
    return <VolumeUpIcon />;
};

VolumeIcon.propTypes = {
    volume: PropTypes.number,
};

const VolumeControls = () => {
    const { audioVolume } = useServerStream();
    const [backdropOpen, setBackdropOpen] = useState(false);

    const handleButtonClick = useCallback(() => {
        setBackdropOpen(true);
    }, []);

    const handleBackdropClose = useCallback(() => {
        setBackdropOpen(false);
    }, []);

    const handleVolumeChange = useCallback((volume) => {
        ServerStream.setAudioVolume(volume);
    }, []);

    return (
        <div className="HmcVolumeControls-root">
            <ControlButton
                inactive={audioVolume === 0}
                onClick={handleButtonClick}
                className="HmcVolumeControls-button"
            >
                <VolumeIcon volume={audioVolume} />
            </ControlButton>
            <Dialog
                open={backdropOpen}
                onClose={handleBackdropClose}
                className="HmcVolumeControls-dialog"
            >
                <DialogContent>
                    <VolumeSlider
                        value={audioVolume}
                        onChange={handleVolumeChange}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VolumeControls;

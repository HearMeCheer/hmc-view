import { useCallback } from 'react';

import { CallEnd as DisconnectIcon } from '@mui/icons-material';

import RtcConnection from '../app/RtcConnection';
import ControlButton from './ControlButton';

const DisconnectControls = () => {
    const handleDisconnect = useCallback(() => {
        RtcConnection.disconnect();
    }, []);

    return (
        <ControlButton inactive onClick={handleDisconnect}>
            <DisconnectIcon />
        </ControlButton>
    );
};

export default DisconnectControls;

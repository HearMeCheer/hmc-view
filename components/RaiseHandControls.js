import React, { useCallback } from 'react';

import { PanToolOutlined as PanToolOutlinedIcon } from '@mui/icons-material';
import { styled } from '@mui/material';

import AuthParticipant from '../app/AuthParticipant';
import { setHandRaised } from '../app/requests';
import { useEvent } from '../providers/EventProvider';
import { useParticipant } from '../providers/ParticipantProvider';
import ControlButton from './ControlButton';

const RaiseHandButton = styled(ControlButton, {
    shouldForwardProp: (prop) => prop !== 'isHandRaised',
})(({ theme, isHandRaised }) => ({
    ...(isHandRaised && {
        background: theme.palette.blue.main,
        '&:hover': {
            background: theme.palette.blue.light,
        },
    }),

    '& > svg': {
        color: theme.palette.blue.main,
        marginRight: theme.spacing(0.5),
        ...(isHandRaised && { color: theme.palette.common.white }),
    },
}));

const RaiseHandControls = () => {
    const { allowRaiseHand } = useEvent();
    const { isHandRaised } = useParticipant();

    const toggleHandRaised = useCallback(async () => {
        try {
            const response = await setHandRaised(!isHandRaised);
            AuthParticipant.update(response.data);
        } catch {
            // TODO handle error
        }
    }, [isHandRaised]);

    if (!allowRaiseHand) {
        return null;
    }
    return (
        <RaiseHandButton isHandRaised={isHandRaised} onClick={toggleHandRaised}>
            <PanToolOutlinedIcon />
        </RaiseHandButton>
    );
};

export default RaiseHandControls;

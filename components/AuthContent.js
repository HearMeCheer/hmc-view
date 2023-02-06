import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Typography } from '@mui/material';

import { useEvent } from '../providers/EventProvider';
import { useExternalContext } from '../providers/ExternalApiProvider';
import HmcBrand from './HmcBrand';

const AuthContent = ({ children }) => {
    const { participantName: externalParticipantName } = useExternalContext();
    const { allowAnonymousUsers } = useEvent();

    if (!allowAnonymousUsers && !externalParticipantName) {
        return (
            <Stack
                direction="row"
                spacing={4}
                alignItems="center"
                justifyContent="center"
                sx={{ flexGrow: 1 }}
                className="HmcApp-Stack"
            >
                <HmcBrand />
                <Typography>Sign-In to Get Started</Typography>
            </Stack>
        );
    }
    return children;
};

AuthContent.propTypes = {
    children: PropTypes.node,
};

export default AuthContent;

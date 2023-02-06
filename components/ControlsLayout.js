import React from 'react';

import { Stack } from '@mui/material';

import AudioInputControls from '../components/AudioInputControls';
import DisconnectControls from '../components/DisconnectControls';
import HmcBrand from '../components/HmcBrand';
import PartyControls from '../components/PartyControls';
import RaiseHandControls from '../components/RaiseHandControls';
import VideoControls from '../components/VideoControls';
import VolumeControls from '../components/VolumeControls';

const ControlsLayout = () => (
    <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        className="HmcControls-Stack"
    >
        <HmcBrand />
        <VideoControls />
        <VolumeControls />
        <PartyControls />
        <RaiseHandControls />
        <AudioInputControls />
        {process.env.NEXT_PUBLIC_APP_ENV === 'development' && (
            <DisconnectControls />
        )}
    </Stack>
);

export default ControlsLayout;

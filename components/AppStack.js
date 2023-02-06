import React from 'react';

import { Stack } from '@mui/material';
import clsx from 'clsx';

import ControlsLayout from '../components/ControlsLayout';
import { useServerStream } from '../providers/ServerStreamProvider';
import MainStage from './MainStage';

const AppStack = () => {
    const { videoTrackCount } = useServerStream();
    return (
        <Stack
            spacing={1}
            alignItems="center"
            sx={videoTrackCount === 0 ? null : { mt: 'auto', zIndex: 5 }}
            className={clsx('HmcApp-Stack')}
        >
            <ControlsLayout />
            <MainStage />
        </Stack>
    );
};

export default AppStack;

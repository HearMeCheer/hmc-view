import React from 'react';

import { styled } from '@mui/material/styles';

import { useMessageChannel } from '../providers/MessageChannelProvider';
import AudioVisualizerIcon from './AudioVisualizerIcon';
import Badge from './Badge';

const Background = styled('div')(({ theme }) => ({
    width: theme.spacing(8),
    height: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#171717',
    borderRadius: '50%',
    padding: theme.spacing(1),
}));

const HmcBrand = () => {
    const { mainStageParticipantCount } = useMessageChannel();
    return (
        <Badge badgeContent={mainStageParticipantCount} max={9999}>
            <Background className="HmcBrand-root">
                <AudioVisualizerIcon />
            </Background>
        </Badge>
    );
};

export default HmcBrand;

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import {
    Add as AddIcon,
    ExitToApp as LeaveIcon,
    GroupOutlined as PartyIcon,
    Send as SendIcon,
    IosShare as ShareIcon,
} from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

import AuthParticipant from '../app/AuthParticipant';
import { joinParty, leaveParty } from '../app/requests';
import { useMessageChannel } from '../providers/MessageChannelProvider';
import { useParticipant } from '../providers/ParticipantProvider';
import Badge from './Badge';
import ChatHead from './ChatHead';
import ControlButton from './ControlButton';
import Dialog from './Dialog';
import DialogContent from './DialogContent';
import PrimaryButton from './PrimaryButton';
import ScalingTooltip from './ScalingTooltip';
import ShareButton from './ShareButton';
import TextField from './TextField';

const parseCodeFromUrl = (uri) => {
    try {
        const url = new URL(uri);
        return url.searchParams.get('hmc-roomId');
    } catch (e) {
        return null;
    }
};

const resolveRoomId = (roomIdOrUrl) => {
    if (!roomIdOrUrl) {
        return null;
    }
    if (roomIdOrUrl.startsWith('http')) {
        return parseCodeFromUrl(roomIdOrUrl);
    }
    return roomIdOrUrl;
};

const JoinView = () => {
    const [joinCode, setJoinCode] = useState('');

    const handleChange = useCallback((e) => {
        const { value } = e.target;
        setJoinCode(value);
    }, []);

    const handleJoinParty = useCallback(async () => {
        try {
            const response = await joinParty(resolveRoomId(joinCode));
            AuthParticipant.update(response.data);
        } catch (err) {
            console.error(err);
        }
    }, [joinCode]);

    return (
        <DialogContent justifyContent="space-between">
            <TextField
                placeholder="Paste Invite Code"
                autoFocus
                fullWidth
                value={joinCode}
                onChange={handleChange}
                onSubmit={handleJoinParty}
            />
            <ScalingTooltip title={joinCode ? 'Join Room' : 'Create New Room'}>
                <PrimaryButton onClick={handleJoinParty}>
                    <AddIcon sx={!joinCode ? null : { display: 'none' }} />
                    <SendIcon sx={joinCode ? null : { display: 'none' }} />
                </PrimaryButton>
            </ScalingTooltip>
        </DialogContent>
    );
};

const PopulatedView = ({ toggleShare }) => {
    const { partyStageSpeakerCount } = useMessageChannel();

    const handleLeaveClick = useCallback(async () => {
        try {
            const response = await leaveParty();
            AuthParticipant.update(response.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <DialogContent justifyContent="space-between">
            <ScalingTooltip title="Share">
                <IconButton onClick={toggleShare}>
                    <ShareIcon sx={{ color: 'green.main' }} />
                </IconButton>
            </ScalingTooltip>

            {[...Array(partyStageSpeakerCount)].map((_, position) => (
                <ChatHead key={position} position={position} isParty />
            ))}

            <ScalingTooltip title="Leave Party">
                <IconButton onClick={handleLeaveClick}>
                    <LeaveIcon />
                </IconButton>
            </ScalingTooltip>
        </DialogContent>
    );
};
PopulatedView.propTypes = {
    toggleShare: PropTypes.func,
};

const ShareView = ({ toggleShare }) => {
    const { partyRoom } = useParticipant();
    return (
        <DialogContent sx={{ bgcolor: 'green.main' }}>
            <ShareButton onShare={toggleShare} />
            <Typography
                sx={{
                    fontSize: '1.4rem',
                    color: 'green.dark',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {partyRoom}
            </Typography>
        </DialogContent>
    );
};

ShareView.propTypes = {
    toggleShare: PropTypes.func,
};

const PartyButton = ({ ...buttonProps }) => {
    const { partyStageParticipantCount } = useMessageChannel();
    return (
        <Badge badgeContent={partyStageParticipantCount}>
            <ControlButton className="HmcPartyControls-button" {...buttonProps}>
                <PartyIcon />
            </ControlButton>
        </Badge>
    );
};

const PartyControls = () => {
    const participant = useParticipant();
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [view, setView] = useState('join');

    useEffect(() => {
        if (!participant.partyRoom) {
            setView('join');
        } else {
            setView('populated');
        }
    }, [participant.partyRoom]);

    const handleButtonClick = useCallback(() => {
        setBackdropOpen(true);
    }, []);

    const handleBackdropClose = useCallback(() => {
        setBackdropOpen(false);
        if (view === 'share') {
            setView('populated');
        }
    }, [view]);

    const toggleShare = useCallback(() => {
        setView((view) => (view === 'share' ? 'populated' : 'share'));
    }, []);

    return (
        <div className="HmcPartyControls-root">
            <PartyButton onClick={handleButtonClick} />
            <Dialog
                open={backdropOpen}
                onClose={handleBackdropClose}
                className="HmcPartyControls-dialog"
            >
                {view === 'join' ? (
                    <JoinView />
                ) : view === 'share' ? (
                    <ShareView toggleShare={toggleShare} />
                ) : view === 'populated' ? (
                    <PopulatedView toggleShare={toggleShare} />
                ) : (
                    <Typography>Unhandled view: {view}</Typography>
                )}
            </Dialog>
        </div>
    );
};

export default PartyControls;

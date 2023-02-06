import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { styled } from '@mui/material';
import clsx from 'clsx';

import MessageChannel from '../app/MessageChannel';
import useParticipantProfile from '../app/useParticipantProfile';
import UserAvatar from './Avatar';
import ScalingTooltip from './ScalingTooltip';

const Profile = ({ participantId, onClick }) => {
    const profile = useParticipantProfile(participantId);

    const handleClick = useCallback(
        (e) => {
            if (onClick) {
                onClick(e, participantId);
            }
        },
        [onClick, participantId],
    );

    return (
        <ScalingTooltip title={profile.name || ''}>
            <UserAvatar
                name={profile.name}
                icon={profile.icon}
                src={profile.avatarUrl ? profile.avatarUrl : null}
                onClick={handleClick}
            />
        </ScalingTooltip>
    );
};
Profile.propTypes = {
    participantId: PropTypes.string,
    onClick: PropTypes.func,
};

const VolumeIndicator = styled('div')({
    border: '1px solid rgba(0, 0, 0, 0)',
    borderRadius: '50%',
});

const ChatHead = ({ position, isParty, onClick }) => {
    const [participantId, setParticipantId] = useState(null);
    const elRef = useRef(null);

    useEffect(() => {
        const key = isParty ? 'partyStageSpeakerList' : 'mainStageSpeakerList';
        const { participantId, volume } = MessageChannel[key][position];

        setParticipantId(participantId);
        elRef.current.style.opacity = Math.max(volume, 0.3);
        elRef.current.style.borderColor =
            volume > 0.65 ? '#E32C6D' : 'rgba(0, 0, 0, 0)';
    }, [isParty, position]);

    useEffect(() => {
        const key = isParty ? 'partyStageSpeakerList' : 'mainStageSpeakerList';
        return MessageChannel.onStateChange(({ type, payload }) => {
            if (type !== key || position >= payload.length) return;

            const { participantId, volume } = payload[position];
            setParticipantId(participantId);
            elRef.current.style.opacity = Math.max(volume, 0.3);
            elRef.current.style.borderColor =
                volume > 0.65 ? '#E32C6D' : 'rgba(0, 0, 0, 0)';
        });
    }, [isParty, position]);

    return (
        <VolumeIndicator
            ref={elRef}
            className={clsx('HmcParticipant-Avatar', {
                'HmcParticipant-RoomAudio': participantId === 'background',
            })}
        >
            <Profile participantId={participantId} onClick={onClick} />
        </VolumeIndicator>
    );
};
ChatHead.propTypes = {
    position: PropTypes.number.isRequired,
    isParty: PropTypes.bool,
    onClick: PropTypes.func,
};
ChatHead.defaultProps = {};

export default ChatHead;

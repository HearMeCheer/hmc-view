import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { Flag as ReportIcon } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';

import Snackbar from '../app/Snackbar';
import { reportParticipant } from '../app/requests';
import useParticipantProfile from '../app/useParticipantProfile';
import UserAvatar from './Avatar';
import Dialog from './Dialog';
import DialogContent from './DialogContent';
import ScalingTooltip from './ScalingTooltip';

const SelectedChatHeadDialog = ({ participantId, onClose, ...dialogProps }) => {
    const profile = useParticipantProfile(participantId);

    const handleReport = useCallback(() => {
        reportParticipant(participantId).then((body) => {
            if (body) {
                Snackbar.emitSuccess('Report Sent');
            } else {
                Snackbar.emitError('Report Failed. Please try again');
            }
        });
        onClose();
    }, [participantId, onClose]);

    return (
        <Dialog
            open={participantId !== null}
            onClose={onClose}
            {...dialogProps}
        >
            <DialogContent justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                    <UserAvatar
                        name={profile.name}
                        src={profile.avatarUrl ? profile.avatarUrl : null}
                    />
                    <Typography>{profile.name}</Typography>
                </Stack>
                {!profile.isSystem && (
                    <ScalingTooltip title="Report">
                        <IconButton color="error" onClick={handleReport}>
                            <ReportIcon />
                        </IconButton>
                    </ScalingTooltip>
                )}
            </DialogContent>
        </Dialog>
    );
};

SelectedChatHeadDialog.propTypes = {
    participantId: PropTypes.string,
    onClose: PropTypes.func,
};

export default SelectedChatHeadDialog;

import React, { useCallback, useEffect, useState } from 'react';

import { Send as SendIcon } from '@mui/icons-material';

import AuthParticipant from '../app/AuthParticipant';
import RtcConnection from '../app/RtcConnection';
import Snackbar from '../app/Snackbar';
import { signIn } from '../app/requests';
import { useEvent } from '../providers/EventProvider';
import { useExternalContext } from '../providers/ExternalApiProvider';
import { useParticipant } from '../providers/ParticipantProvider';
import { useRtcConnection } from '../providers/RtcConnectionProvider';
import Dialog from './Dialog';
import DialogContent from './DialogContent';
import PrimaryButton from './PrimaryButton';
import TextField from './TextField';

const JoinEventDialog = () => {
    const { tagline, maxVideoTracks } = useEvent();
    const { participantName: externalParticipantName } = useExternalContext();
    const { name: sessionName, connectionUrl, iceUrl } = useParticipant();
    const { connectionState } = useRtcConnection();
    const [name, setName] = useState('');
    const [userReady, setUserReady] = useState(false);

    useEffect(() => {
        if (externalParticipantName) {
            setName(externalParticipantName);
        } else if (sessionName) {
            setName(sessionName);
        }
    }, [externalParticipantName, sessionName]);

    useEffect(() => {
        if (userReady && !RtcConnection.connectionStarted) {
            RtcConnection.connect({
                connectionUrl,
                iceUrl,
                enableMessageChannel: true,
                maxVideoTracks,
            }).catch((err) => {
                if (err.name == 'NotAllowedError') {
                    Snackbar.emitError(
                        'Device (Microphone): ' + err.toString(),
                    );
                } else {
                    Snackbar.emitError(err.toString());
                }
                console.error('Error connecting, mic access granted?', err);
                setUserReady(false);
            });
            return () => RtcConnection.disconnect();
        }
    }, [userReady, connectionUrl, iceUrl, maxVideoTracks]);

    useEffect(() => {
        if (connectionState === 'disconnected') {
            setUserReady(false);
        }
    }, [connectionState]);

    const handleChange = useCallback((e) => setName(e.target.value), []);

    const handleSubmit = useCallback(async () => {
        try {
            if (sessionName !== name) {
                const response = await signIn(name);
                AuthParticipant.update(response.data);
            }
            setUserReady(true);
        } catch (err) {
            // console.error('meow');
            console.error(err);
            // setUserReady(false);
            Snackbar.emitError(
                'Failed to connect to server. Please try again later',
            );
        }
    }, [sessionName, name]);

    return (
        <Dialog open={!userReady} tagline={tagline} disableGrow>
            <DialogContent>
                <TextField
                    disabled={Boolean(externalParticipantName)}
                    placeholder="Display Name"
                    fullWidth
                    value={name}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
                <PrimaryButton onClick={handleSubmit}>
                    <SendIcon />
                </PrimaryButton>
            </DialogContent>
        </Dialog>
    );
};

export default JoinEventDialog;

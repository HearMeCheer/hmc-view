import { useCallback, useEffect, useRef, useState } from 'react';

import {
    CallEnd as DisconnectIcon,
    Mic as MicIcon,
    MicNone as MicNoneIcon,
    MicOff as MicOffIcon,
} from '@mui/icons-material';
import { Button, IconButton, Stack } from '@mui/material';
import { red } from '@mui/material/colors';

import { updateParticipant } from '../../app/HmcApi';
import {
    closeMediaStream,
    connectWithBlankMedia,
    getUserMicrophoneMediaStream,
    replaceUserMediaStream,
} from '../../app/rtc';
import ColoredIconButton from '../../components/ColoredIconButton';

const Simple = ({ connectionUrl, iceUrl }) => {
    const peerConnectionRef = useRef();
    const microphoneStreamRef = useRef();
    const audioElRef = useRef();
    const [connectionState, setConnectionState] = useState('disconnected');
    const [usingMicrophone, setUsingMicrophone] = useState(false);
    const [microphoneMuted, setMicrophoneMuted] = useState(false);

    const handleServerTrack = useCallback((track) => {
        audioElRef.current.srcObject = new MediaStream([track]);
        audioElRef.current.play();
    }, []);

    const handleConnectionStateChange = useCallback((state) => {
        setConnectionState(state);
    }, []);

    const connect = useCallback(async () => {
        const [connection, stream] = await connectWithBlankMedia(
            connectionUrl,
            iceUrl,
            {
                onServerTrack: handleServerTrack,
                onConnectionStateChange: handleConnectionStateChange,
            },
        );
        peerConnectionRef.current = connection;
        microphoneStreamRef.current = stream;
    }, [connectionUrl, iceUrl, handleConnectionStateChange, handleServerTrack]);

    const disconnect = useCallback(() => {
        if (microphoneStreamRef.current) {
            closeMediaStream(microphoneStreamRef.current);
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setConnectionState('disconnected');
        setUsingMicrophone(false);
        setMicrophoneMuted(false);
    }, []);

    const useMicrophone = useCallback(async () => {
        if (microphoneStreamRef.current) {
            closeMediaStream(microphoneStreamRef.current);
        }
        microphoneStreamRef.current = await getUserMicrophoneMediaStream();
        replaceUserMediaStream(
            peerConnectionRef.current,
            microphoneStreamRef.current,
        );
        setUsingMicrophone(true);
    }, []);

    const toggleMicrophoneMuted = useCallback(() => {
        setMicrophoneMuted((muted) => !muted);
    }, []);

    useEffect(() => {
        if (microphoneStreamRef.current) {
            for (const track of microphoneStreamRef.current.getTracks()) {
                track.enabled = !microphoneMuted;
            }
        }
    }, [microphoneMuted]);

    return (
        <Stack spacing={2} alignItems="flex-start">
            {connectionState === 'disconnected' ? (
                <Button onClick={connect}>Connect</Button>
            ) : (
                <Stack spacing={2} direction="row">
                    <ColoredIconButton color={red[500]} onClick={disconnect}>
                        <DisconnectIcon />
                    </ColoredIconButton>
                    {!usingMicrophone ? (
                        <ColoredIconButton
                            color={red[500]}
                            onClick={useMicrophone}
                        >
                            <MicNoneIcon />
                        </ColoredIconButton>
                    ) : microphoneMuted ? (
                        <IconButton onClick={toggleMicrophoneMuted}>
                            <MicOffIcon />
                        </IconButton>
                    ) : (
                        <IconButton onClick={toggleMicrophoneMuted}>
                            <MicIcon />
                        </IconButton>
                    )}
                </Stack>
            )}
            <audio ref={audioElRef} />
        </Stack>
    );
};

export default Simple;

export const getServerSideProps = async () => {
    const [err, participant] = await updateParticipant(
        {
            propertyId: 'test-property',
            eventId: 'test-event',
            participantId: 'simple-participant',
        },
        {
            name: 'Simple Participant',
            rooms: {
                'main-stage': { listenGain: 1, micGain: 0 },
                audience: { listenGain: 1, micGain: 1 },
            },
            checkExists: false,
        },
    );
    if (err) throw err;

    const { connectionUrl, iceUrl } = participant;
    return { props: { connectionUrl, iceUrl } };
};

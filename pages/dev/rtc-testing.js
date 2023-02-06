import { Divider, Stack } from '@mui/material';

import { updateParticipant } from '../../app/HmcApi';
import { withSessionSsr } from '../../app/session';
import { participantToView } from '../../app/transformers';
import Simple from './simple';

const Test = ({ participant1, participant2 }) => (
    <Stack spacing={6} divider={<Divider />}>
        <Simple
            connectionUrl={participant1.connectionUrl}
            iceUrl={participant1.iceUrl}
        />
        <Simple
            connectionUrl={participant2.connectionUrl}
            iceUrl={participant2.iceUrl}
        />
    </Stack>
);

export default Test;

export const getServerSideProps = withSessionSsr(async () => {
    const makeContext = (participantId) => ({
        propertyId: 'test-property',
        eventId: 'test-event',
        participantId,
    });
    const rooms = {
        'main-stage': { listenGain: 1, micGain: 0 },
        audience: { listenGain: 1, micGain: 1 },
    };

    const [err1, participant1] = await updateParticipant(
        makeContext('rtc-test-participant-1'),
        { name: 'Participant 1', rooms, checkExists: false },
    );
    if (err1) throw err1;

    const [err2, participant2] = await updateParticipant(
        makeContext('rtc-test-participant-2'),
        { name: 'Participant 2', rooms, checkExists: false },
    );
    if (err2) throw err2;

    return {
        props: {
            participant1: participantToView(participant1),
            participant2: participantToView(participant2),
        },
    };
});

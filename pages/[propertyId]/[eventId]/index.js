import Head from 'next/head';
import PropTypes from 'prop-types';

import debug from 'debug';

import {
    createParticipant,
    getOrCreateEvent,
    getParticipant,
    updateParticipant,
} from '../../../app/HmcApi';
import checkSiteAuth from '../../../app/checkSiteAuth';
import { jwtSign } from '../../../app/jwt';
import { withSessionSsr } from '../../../app/session';
import { eventToView, participantToView } from '../../../app/transformers';
import AppRoot from '../../../components/AppRoot';
import ExposeDevVars from '../../../components/ExposeDevVars';

const setupParticipant = async ({ context, sessionId, canSendVideo }) => {
    if (!sessionId) {
        return await createParticipant(context, { name: '', canSendVideo });
    }
    const participantContext = {
        ...context,
        participantId: sessionId,
    };
    const [err, participant] = await getParticipant(participantContext);
    if (err) {
        if (err.status === 404) {
            return await createParticipant(context, { name: '', canSendVideo });
        }
        return [err];
    }
    if (participant.canSendVideo !== canSendVideo) {
        return await updateParticipant(participantContext, { canSendVideo });
    }
    return [null, participant];
};

const logger = debug('hmc-view:JoinEventPage');

const JoinEventPage = ({
    authToken,
    event: { customStyles, ...event },
    participant,
}) => (
    <>
        <Head>
            <title>
                {event.name + ' | ' + process.env.NEXT_PUBLIC_APP_NAME}
            </title>
            {customStyles && (
                <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            )}
        </Head>
        <AppRoot
            authToken={authToken}
            event={event}
            participant={participant}
        />
        {(process.env.NEXT_PUBLIC_EXPOSE_DEV_VARS === '1' ||
            process.env.NEXT_PUBLIC_APP_ENV === 'development') && (
            <ExposeDevVars />
        )}
    </>
);

JoinEventPage.propTypes = {
    authToken: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    participant: PropTypes.object.isRequired,
};
JoinEventPage.defaultProps = {};

// TODO block unsafe usage when allowAnonymousUsers is false (requires system rework)
const _getServerSideProps = async ({ req, query }) => {
    const {
        session,
        headers: { referer },
    } = req;
    const { propertyId, eventId, disableCache, video } = query;

    const [status, message] = await checkSiteAuth(propertyId, referer);
    if (status === 404) {
        return { notFound: true };
    }
    if (status !== 200) {
        const queryParams = new URLSearchParams();
        queryParams.append('status', status);
        queryParams.append('message', message);
        return {
            redirect: {
                destination: '/error?' + queryParams.toString(),
            },
        };
    }

    logger('session.participantContext', session.participantContext);
    const sessionId = disableCache
        ? null
        : session.participantContext?.participantId;
    logger('sessionId', sessionId);

    const eventContext = { propertyId, eventId };
    const [errEvent, event] = await getOrCreateEvent(eventContext, {
        id: eventId,
        name: eventId,
    });
    if (errEvent) {
        if (errEvent.status === 404) return { notFound: true };
        throw errEvent;
    }
    logger('Event:', event);

    const [errParticipant, participant] = await setupParticipant({
        context: eventContext,
        sessionId,
        canSendVideo: video === '1',
    });
    if (errParticipant) throw errParticipant;
    logger('Participant:', participant);

    const participantContext = {
        propertyId,
        eventId,
        participantId: participant.id,
    };

    // naive object comparison
    if (
        JSON.stringify(participantContext) !==
        JSON.stringify(session.participantContext)
    ) {
        session.participantContext = participantContext;
        await session.save();
    }

    const authToken = await jwtSign(participantContext);

    return {
        props: {
            authToken,
            event: eventToView(event),
            participant: participantToView(participant),
        },
    };
};

export const getServerSideProps = withSessionSsr(_getServerSideProps);

export default JoinEventPage;

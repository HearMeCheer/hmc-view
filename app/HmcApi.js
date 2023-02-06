import debug from 'debug';

import makeRequest from './makeRequest';

const logger = debug('hmc-view:HmcApi');

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const makeApiRequest = async ({
    method,
    path,
    context,
    body,
    basePath = process.env.HMC_API_URL,
    field = 'item',
}) => {
    const headers = {
        'X-API-KEY': process.env.HMC_API_KEY,
        ...(context?.propertyId && {
            'X-PROPERTY-ID': context.propertyId,
        }),
    };
    const [err, response] = await makeRequest({
        method,
        path,
        context,
        body,
        headers,
        basePath,
    });
    if (err) {
        if (err.response) {
            const { response } = err;
            logger('Recieved response [', response.status, ']', response.data);
            return [new HttpError(response.status, response.data.message)];
        } else {
            return [err];
        }
    }
    if (!response.headers['content-type']?.includes('application/json')) {
        logger('Response was not of type JSON: ', response.data);
        return [new HttpError(415, 'Response received was not JSON')];
    }
    const result = field ? response.data[field] : response.data;
    logger('api item result:', result);
    return [null, result];
};

export const getViewSettings = (context) =>
    makeApiRequest({ method: 'GET', path: '/keys/embed', context });

export const updateViewSettings = (context, body) =>
    makeApiRequest({ method: 'PUT', path: '/keys/embed', context, body });

export const getEvent = (context) =>
    makeApiRequest({ method: 'GET', path: '/events/:eventId', context });

export const createEvent = (context, body) =>
    makeApiRequest({ method: 'POST', path: '/events', context, body });

export const getOrCreateEvent = async (context, body) => {
    const [err, event] = await getEvent(context);
    if (err && err.status === 404 && err.message.includes('Event')) {
        return await createEvent(context, body);
    }
    return [err, event];
};

export const getParticipant = (context) =>
    makeApiRequest({
        method: 'GET',
        path: '/events/:eventId/participants/:participantId',
        context,
    });

export const createParticipant = (context, body) =>
    makeApiRequest({
        method: 'POST',
        path: '/events/:eventId/participants',
        context,
        body,
    });

export const updateParticipant = (context, body) =>
    makeApiRequest({
        method: 'PUT',
        path: '/events/:eventId/participants/:participantId',
        context,
        body,
    });

export const joinParty = (context) =>
    makeApiRequest({
        method: 'POST',
        path: '/events/:eventId/participants/:participantId/join-party/:roomId',
        context,
    });

export const leaveParty = (context) =>
    makeApiRequest({
        method: 'POST',
        path: '/events/:eventId/participants/:participantId/leave-party',
        context,
    });

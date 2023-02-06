import { NextResponse } from 'next/server';

import debug from 'debug';

import makeUrl from '../../../app/makeUrl';

const logger = debug('hmc-view:[propertyId]/[eventId]/_middleware');

// TODO refactor, common element in view and api
const ForceSslMiddleware = ({ headers, nextUrl: { pathname } }) => {
    if (!process.env.APP_URL.startsWith('https://')) {
        return NextResponse.next();
    }
    logger('checking if protocol is https...');
    if (headers.get('x-forwarded-proto') !== 'https') {
        logger('connection is not secure');
        return NextResponse.redirect(makeUrl(pathname));
    }
    logger('connection is secure!');
    return NextResponse.next();
};

const handler = async (req) => {
    let response;

    response = await ForceSslMiddleware(req);
    if (response) return response;
};

export default handler;

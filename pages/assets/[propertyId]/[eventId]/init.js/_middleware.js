import { NextResponse } from 'next/server';

import makeUrl from '../../../../../app/makeUrl';

const makeApiCall = ({ propertyId, eventId }) =>
    fetch(new URL('/api/make-script', process.env.APP_URL), {
        method: 'POST',
        headers: {
            // accept: 'text/javascript',
            'content-type': 'application/json',
        },
        body: JSON.stringify({ propertyId, eventId }),
    });

const handler = async ({ nextUrl: { pathname } }) => {
    const [, , propertyId, eventId] = pathname.split('/');
    try {
        const response = await makeApiCall({ propertyId, eventId });
        const responseData = await response.text();
        return new Response(responseData, {
            headers: { 'content-type': 'text/javascript' },
        });
    } catch (err) {
        const queryParams = new URLSearchParams();
        queryParams.append('status', err.status || '');
        queryParams.append('message', err.message || '');
        return NextResponse.rewrite(
            makeUrl('/error?' + queryParams.toString()),
        );
    }
};

export default handler;

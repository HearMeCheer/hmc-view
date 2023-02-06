import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

const sessionOptions = {
    password: process.env.SESSION_SECRET,
    cookieName: 'hmc-sessionId',
    cookieOptions: {
        secure: process.env.APP_URL.startsWith('https'),
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'none',
    },
};

export const withSessionApiRoute = (handler) =>
    withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSsr = (handler) =>
    withIronSessionSsr(handler, sessionOptions);

import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const _sign = promisify(jwt.sign);
export const jwtSign = (payload) =>
    _sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });

const _verify = promisify(jwt.verify);
export const jwtVerify = (token) =>
    _verify(token, process.env.JWT_SECRET, { algorithm: 'HS256' });

export const withJsonWebToken =
    (handler, config = {}) =>
    async (req, res) => {
        const { requireAuth = true } = config;

        const token = req.headers['x-token'];
        if (!token) {
            if (requireAuth) {
                res.status(401).json({ message: 'Missing Required Token' });
                return;
            }
            req.auth = null;
            await handler(req, res);
            return;
        }

        try {
            req.auth = await jwtVerify(token);
        } catch (err) {
            console.error('error verifiying token:', err);
            if (requireAuth) {
                res.status(403).json({ message: 'Session Expired' });
                return;
            }
        }

        req.auth = req.auth ?? null;
        await handler(req, res);
    };

// export const withSessionSsr = (handler, config) => async (context) => {
//     const { requireAuth = true } = config;
//     const { req } = context;

//     const token = req.headers['x-token'];
//     if (!token) {
//         if (requireAuth) {
//             return { notFound: true };
//         }
//         req.session = null;
//         return await handler(context);
//     }

//     try {
//         req.session = await jwtVerify(token);
//     } catch (err) {
//         if (requireAuth) {
//             return { notFound: true };
//         }
//     }

//     req.session = req.session ?? null;
//     return await handler(context);
// };

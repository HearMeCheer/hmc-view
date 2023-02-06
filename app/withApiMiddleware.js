import { withJsonWebToken } from './jwt';

const composeMiddleware =
    (middlewareList, routeCallback, config) => async (req, res) => {
        for (const middleware of middlewareList) {
            const handlerCalled = await new Promise((resolve) => {
                middleware(() => resolve(true), config)(req, res).then(() =>
                    resolve(false),
                );
            });
            if (!handlerCalled) {
                return; // abort
            }
        }
        await routeCallback(req, res);
    };

const middlewareList = [
    // withSentry,
    withJsonWebToken,
];

const withApiMiddleware = (routeCallback, config = {}) =>
    composeMiddleware(middlewareList, routeCallback, config);

export default withApiMiddleware;

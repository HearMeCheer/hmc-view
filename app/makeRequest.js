import axios from 'axios';
import debug from 'debug';

import makeUrl from './makeUrl';

// const getAdapter = () => {
//     if (typeof process !== 'undefined') {
//         return require('axios/lib/adapters/http');
//     }
//     return require('@vespaiach/axios-fetch-adapter');
// };

// manually create axios instance with http adapter to prevent "adapter not found" when using middleware
// const axios = _axios.create({ adapter: getAdapter() });

const logger = debug('hmc-view:makeRequest');

const replacePathWithContext = (path, context) => {
    let pathWithContext = path;
    while (pathWithContext.includes(':')) {
        const startingIndex = pathWithContext.indexOf(':');
        const endingIndex = pathWithContext.indexOf('/', startingIndex);
        const param =
            endingIndex < 0
                ? pathWithContext.substring(startingIndex)
                : pathWithContext.substring(startingIndex, endingIndex);
        const paramValue = context[param.substring(1)];
        if (typeof paramValue === 'undefined') {
            return [
                new Error(`Missing Param Value for param ${param} in context`),
            ];
        }
        pathWithContext = pathWithContext.replace(param, paramValue);
    }
    return [null, pathWithContext];
};

const makeRequest = async ({
    method,
    path,
    context,
    headers,
    basePath,
    body,
}) => {
    const [err, pathWithContext] = replacePathWithContext(path, context);
    if (err) return [err];

    try {
        const requestConfig = {
            url: makeUrl(pathWithContext, basePath).href,
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            data: body,
        };
        logger('making request', requestConfig);
        const response = await axios(requestConfig);
        return [null, response];
    } catch (err) {
        logger(
            'Error making request [%s]: ',
            makeUrl(pathWithContext, basePath).href,
            err,
        );
        return [err];
    }
};

export default makeRequest;

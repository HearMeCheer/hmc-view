import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useReducer } from 'react';

import debug from 'debug';

import ExternalApi from '../app/ExternalApi';

const logger = debug('hmc-view:ExternalApiProvider');

const initialState = {
    parentHref: null,
    participantName: null,
    partticipantInfo: null,
};

const ExternalApiContext = createContext(initialState);
export const useExternalContext = () => useContext(ExternalApiContext);

const stateReducer = (state, { type, payload }) => {
    switch (type) {
        case 'parentHref':
            return { ...state, parentHref: payload };
        case 'participantName':
            return { ...state, participantName: payload };
        case 'participantInfo':
            return { ...state, participantInfo: payload };
        case 'reset':
            return { ...initialState };
        default:
            return { ...state };
    }
};

const handleMessage = (evt) => {
    // Failure to check the origin and possibly source properties enables cross-site scripting attacks.
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    const { origin, source, data } = evt;
    // TODO find a way to validate origin and source
    logger(
        'Received message from parent with\n\t- origin [%s]\n\t- source [%o]\n\t- data [%o]',
        origin,
        source,
        data,
    );

    const { type, payload } = data;
    if (!type || typeof payload === 'undefined') return;
    ExternalApi.publish({ type, payload });
};

const ExternalApiProvider = ({ children }) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    useEffect(() => {
        window.addEventListener('message', handleMessage, false);
        return () => window.removeEventListener('message', handleMessage);
    });

    useEffect(() => {
        return ExternalApi.onStateChange(dispatch);
    }, []);

    return (
        <ExternalApiContext.Provider value={state}>
            {children}
        </ExternalApiContext.Provider>
    );
};

ExternalApiProvider.propTypes = { children: PropTypes.node };

export default ExternalApiProvider;

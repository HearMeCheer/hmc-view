import React, { createContext, useContext, useEffect, useReducer } from 'react';

import debug from 'debug';

import LocalStream from '../app/LocalStream';

const logger = debug('hmc-view:LocalStreamProvider');

const initialState = {
    audioEnabled: true,
    videoEnabled: true,
    usingMicrophone: false,
};

const stateReducer = (state, { type, payload }) => {
    logger('dispatching action', { type, payload });
    switch (type) {
        case 'audioEnabled':
            return { ...state, audioEnabled: payload };
        case 'videoEnabled':
            return { ...state, videoEnabled: payload };
        case 'usingMicrophone':
            return { ...state, usingMicrophone: payload };
        case 'reset':
            return { ...initialState };
        default:
            return { ...state };
    }
};

const LocalStreamContext = createContext(initialState);
export const useLocalStream = () => useContext(LocalStreamContext);

const LocalStreamProvider = (props) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    useEffect(() => {
        return LocalStream.onStateChange(dispatch);
    }, []);

    return <LocalStreamContext.Provider value={state} {...props} />;
};

export default LocalStreamProvider;

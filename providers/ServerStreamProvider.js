import React, { createContext, useContext, useEffect, useReducer } from 'react';

import debug from 'debug';

import ServerStream from '../app/ServerStream';

const logger = debug('hmc-view:ServerStreamProvider');

const initialState = {
    audioTrackCount: 0,
    videoTrackCount: 0,
    audioVolume: 100,
};

const stateReducer = (state, { type, payload }) => {
    logger('dispatching action', { type, payload });
    switch (type) {
        case 'audioTrackList':
            return { ...state, audioTrackCount: payload.length };
        case 'videoTrackList':
            return { ...state, videoTrackCount: payload.length };
        case 'audioVolume':
            return { ...state, audioVolume: payload };
        case 'reset':
            return { ...initialState };
        default:
            return { ...state };
    }
};

const ServerStreamContext = createContext(initialState);
export const useServerStream = () => useContext(ServerStreamContext);

const ServerStreamProvider = (props) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    useEffect(() => {
        return ServerStream.onStateChange(dispatch);
    }, []);

    return <ServerStreamContext.Provider value={state} {...props} />;
};

export default ServerStreamProvider;

import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

import debug from 'debug';

import RtcConnection from '../app/RtcConnection';

const logger = debug('hmc-view:RtcConnectionProvider');

const initialState = {
    connectionState: RtcConnection.connectionState,
};

const RtcConnectionContext = createContext(initialState);
export const useRtcConnection = () => useContext(RtcConnectionContext);

const stateReducer = (state, action) => {
    logger('dispatching action', action);
    switch (action.type) {
        case 'connectionState':
            return { ...state, connectionState: action.payload };
        default:
            return { ...state };
    }
};

const RtcConnectionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    useEffect(() => {
        return RtcConnection.onStateChange(dispatch);
    }, []);

    return (
        <RtcConnectionContext.Provider value={state}>
            {children}
        </RtcConnectionContext.Provider>
    );
};

RtcConnectionProvider.propTypes = {
    children: PropTypes.node,
};

export default RtcConnectionProvider;

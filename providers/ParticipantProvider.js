import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

import debug from 'debug';

import AuthParticipant from '../app/AuthParticipant';

const logger = debug('hmc-view:ParticipantProvider');

const ParticipantContext = createContext({});
export const useParticipant = () => useContext(ParticipantContext);

const ParticipantProvider = ({ children, participant }) => {
    const [state, setState] = useState(participant);

    useEffect(() => {
        if (!AuthParticipant.current) {
            AuthParticipant.update(participant);
        }
    }, [participant]);

    useEffect(() => {
        return AuthParticipant.onChange((participant) => {
            logger('state change', participant);
            setState(participant);
        });
    }, []);

    return (
        <ParticipantContext.Provider value={state}>
            {children}
        </ParticipantContext.Provider>
    );
};

ParticipantProvider.propTypes = {
    children: PropTypes.node,
    participant: PropTypes.object,
};

export default ParticipantProvider;

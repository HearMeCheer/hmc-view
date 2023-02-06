import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

import debug from 'debug';

const logger = debug('hmc-view:EventProvider');

const EventContext = createContext({});
export const useEvent = () => useContext(EventContext);

const EventProvider = ({ children, event }) => {
    const [state] = useState(event);

    useEffect(() => {
        logger('state change', state);
    }, [state]);

    return (
        <EventContext.Provider value={state}>{children}</EventContext.Provider>
    );
};

EventProvider.propTypes = {
    children: PropTypes.node,
    event: PropTypes.object,
};

export default EventProvider;

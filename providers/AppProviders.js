import PropTypes from 'prop-types';
import React from 'react';

import Compose from '../components/Compose';
import RtcConnectionProvider from '../providers/RtcConnectionProvider';
import AppScaleProvider from './AppScaleProvider';
import EventProvider from './EventProvider';
import ExposeAuthToken from './ExposeAuthToken';
import ExternalApiProvider from './ExternalApiProvider';
import LocalStreamProvider from './LocalStreamProvider';
import MessageChannelProvider from './MessageChannelProvider';
import ParticipantProvider from './ParticipantProvider';
import ServerStreamProvider from './ServerStreamProvider';
import SnackbarProvider from './SnackbarProvider';

const AppProviders = ({ authToken, event, participant, children }) => (
    <Compose
        components={[
            ExternalApiProvider,
            RtcConnectionProvider,
            LocalStreamProvider,
            ServerStreamProvider,
            MessageChannelProvider,
            [EventProvider, { event }],
            [ParticipantProvider, { participant }],
            [AppScaleProvider, { width: 400, height: 125 }],
            SnackbarProvider,
            [ExposeAuthToken, { authToken }],
        ]}
    >
        {children}
    </Compose>
);

AppProviders.propTypes = {
    event: PropTypes.object,
    participant: PropTypes.object,
    children: PropTypes.node.isRequired,
};
AppProviders.defaultProps = {};

export default AppProviders;

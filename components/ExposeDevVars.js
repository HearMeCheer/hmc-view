import { useEffect } from 'react';

import AuthParticipant from '../app/AuthParticipant';
import LocalStream from '../app/LocalStream';
import MessageChannel from '../app/MessageChannel';
import PubSub from '../app/PubSub';
import RtcConnection from '../app/RtcConnection';
import ServerStream from '../app/ServerStream';

const ExposeDevVars = () => {
    useEffect(() => {
        window.AuthParticipant = AuthParticipant;
        window.LocalStream = LocalStream;
        window.MessageChannel = MessageChannel;
        window.PubSub = PubSub;
        window.RtcConnection = RtcConnection;
        window.ServerStream = ServerStream;
    }, []);

    return null;
};

export default ExposeDevVars;

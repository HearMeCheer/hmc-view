import { useEffect } from 'react';

import Snackbar from '../app/Snackbar';
import { useMessageChannel } from '../providers/MessageChannelProvider';

const BroadcastMessages = () => {
    const { broadcastMessage } = useMessageChannel();

    useEffect(() => {
        if (broadcastMessage) {
            Snackbar.emitSuccess(broadcastMessage);
        }
    }, [broadcastMessage]);

    return null;
};

export default BroadcastMessages;

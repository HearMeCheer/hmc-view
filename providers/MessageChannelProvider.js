import { createContext, useContext, useEffect, useReducer } from 'react';

import MessageChannel from '../app/MessageChannel';

const initialState = {
    active: MessageChannel.active,
    totalRoomVolume: MessageChannel.totalRoomVolume,
    broadcastMessage: MessageChannel.broadcastMessage,
    mainStageParticipantCount: MessageChannel.mainStageParticipantCount,
    partyStageParticipantCount: MessageChannel.partyStageParticipantCount,
    mainStageSpeakerCount: MessageChannel.mainStageSpeakerList.length,
    partyStageSpeakerCount: MessageChannel.partyStageSpeakerList.length,
};

const MessageChannelContext = createContext(initialState);
export const useMessageChannel = () => useContext(MessageChannelContext);

const stateReducer = (state, { type, payload }) => {
    switch (type) {
        case 'active': {
            if (payload) return { ...state, active: payload };
            return { ...initialState };
        }
        case 'totalRoomVolume':
            return { ...state, totalRoomVolume: payload };
        case 'broadcastMessage':
            return { ...state, broadcastMessage: payload };
        case 'mainStageParticipantCount':
            return { ...state, mainStageParticipantCount: payload };
        case 'partyStageParticipantCount':
            return { ...state, partyStageParticipantCount: payload };
        case 'mainStageSpeakerList':
            return { ...state, mainStageSpeakerCount: payload.length };
        case 'partyStageSpeakerList':
            return { ...state, partyStageSpeakerCount: payload.length };
        default:
            return { ...state };
    }
};

const MessageChannelProvider = ({ children }) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    useEffect(() => MessageChannel.onStateChange(dispatch), []);

    return (
        <MessageChannelContext.Provider value={state}>
            {children}
        </MessageChannelContext.Provider>
    );
};

export default MessageChannelProvider;

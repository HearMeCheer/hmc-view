import React, { useCallback, useState } from 'react';

import { Stack } from '@mui/material';

import { useMessageChannel } from '../providers/MessageChannelProvider';
import ChatHead from './ChatHead';
import SelectedChatHeadDialog from './SelectedChatHeadDialog';

const MainStage = () => {
    const [selectedId, setSelectedId] = useState(null);
    const { mainStageSpeakerCount } = useMessageChannel();

    const clearSelection = useCallback(() => {
        setSelectedId(null);
    }, []);

    const handleClick = useCallback((e, participantId) => {
        setSelectedId(participantId);
    }, []);

    return (
        <Stack direction="row" className="HmcMainStage-Stack">
            {[...Array(mainStageSpeakerCount)].map((_, position) => (
                <ChatHead
                    key={position}
                    position={position}
                    onClick={handleClick}
                />
            ))}
            <SelectedChatHeadDialog
                participantId={selectedId}
                onClose={clearSelection}
            />
        </Stack>
    );
};

export default MainStage;

import debug from 'debug';

import AuthParticipant from './AuthParticipant';
import PubSub from './PubSub';

const logger = debug('hmc-view:MessageChannel');

/**
 * @param db {number}
 *   0 --> loud, -100 is quiet, positive is like over the top loud
 *   we want 0 dB which is loud to map to 1.0
 * @return {number} [0-1] (1 is LOUD), suitable for UI, etc
 * dB is 0 --> loud, -100 is quiet, positive is like over the top loud
 * we want 0 dB which is loud to map to 1.0
 * we want -100 dB to be zero
 * vol is now 0 - > 1, but we are interested in the higher end
 */
const convertDbToVolume = (db) => {
    db += 15; // boost
    // dB is 0 --> loud, -100 is quiet, positive is like over the top loud
    // we want 0 dB which is loud to map to 1.0
    // we want -100 dB to be zero
    if (db > 0) {
        db = 0.0;
    }
    if (db < -50.0) {
        // 60 is reasonable for quiet
        db = -50.0;
    }

    // vol is now 0 - > 1, but we are interested in the higher end
    return 1.0 + db / 50.0;
};

/**
 * @param envelope {{
    v: number,
    messageToDisplay: string,
    r: {
        [roomId: string]: {
            c: number,
            v: number,
            l: {
                [participantId: string]: number
            }
        }
    }
}}
 * @return {{
    totalRoomVolume: number,
    mainStageSpeakerList: [],
    mainStageParticipantCount: number,
    partyStageParticipantCount: number,
    partyStageSpeakerList: []
  }}
 */
const transformMessage = ({
    v: totalRoomVolume,
    r: roomVolumes,
    messageToDisplay: broadcastMessage,
}) => {
    const mainStageSpeakerList = [];
    const mainStageProcessedParticipants = {};
    let mainStageParticipantCount = 0;

    const partyStageSpeakerList = [];
    const partyStageProcessedParticipants = {};
    let partyStageParticipantCount = 0;

    for (const [
        roomId,
        // eslint-disable-next-line no-unused-vars
        { l: loudestSpeakers, c: participantCount, v: totalRoomVolume },
    ] of Object.entries(roomVolumes)) {
        if (roomId === AuthParticipant.current?.partyRoom) {
            partyStageParticipantCount += participantCount;
        } else {
            mainStageParticipantCount += participantCount;
        }

        for (const [participantId, db] of Object.entries(
            loudestSpeakers || {},
        )) {
            const [speakerList, processedKey] =
                roomId === AuthParticipant.current?.partyRoom
                    ? [partyStageSpeakerList, partyStageProcessedParticipants]
                    : [mainStageSpeakerList, mainStageProcessedParticipants];

            const isProcessed =
                typeof processedKey[participantId] !== 'undefined';
            if (isProcessed) {
                processedKey[participantId].roomIds.push(roomId);
                continue;
            }

            const speaker = {
                participantId,
                volume: convertDbToVolume(db),
                roomIds: [roomId],
            };
            speakerList.push(speaker);
            processedKey[participantId] = speaker;
        }
    }

    return {
        totalRoomVolume,
        broadcastMessage,
        mainStageParticipantCount,
        partyStageParticipantCount,
        mainStageSpeakerList,
        partyStageSpeakerList,
    };
};

const shouldUpdateStateValue = (val1, val2) => {
    if (!Array.isArray(val1)) {
        return val1 !== val2;
    }
    if (val1.length !== val2.length) {
        return true;
    }
    return Boolean(
        val1.find((v, i) => JSON.stringify(v) !== JSON.stringify(val2[i])),
    );
};

const MessageChannel = {
    active: false,
    totalRoomVolume: 0,
    broadcastMessage: null,
    mainStageParticipantCount: 0,
    partyStageParticipantCount: 0,
    mainStageSpeakerList: [],
    partyStageSpeakerList: [],

    publishStateChange({ type, payload }) {
        PubSub.publish('MessageChannel.state', { type, payload });
    },

    onStateChange(callback) {
        return PubSub.subscribe('MessageChannel.state', callback);
    },

    make(rtcConnection) {
        const rtcDataChannel =
            rtcConnection.createDataChannel('messageChannel');

        rtcDataChannel.onopen = MessageChannel.handleOpen;
        rtcDataChannel.onclose = MessageChannel.handleClose;

        rtcDataChannel.onmessage = (e) => {
            const rawMessage = e.data;
            let untransformed;
            try {
                untransformed = JSON.parse(rawMessage);
            } catch (err) {
                logger(
                    'Error occurred while attempting to parse message:',
                    err,
                );
                logger('Message attempted to parse:', e.data);
                return;
            }

            let transformed;
            try {
                transformed = transformMessage(untransformed);
            } catch (err) {
                logger(
                    'Error occurred while attempting to transform message:',
                    err,
                );
                logger('Message attempted to transform:', untransformed);
                return;
            }

            try {
                setTimeout(
                    () => MessageChannel.handleMessage(transformed),
                    100,
                );
            } catch (err) {
                logger(
                    'Error occurred while attempting to broadcast message:',
                    err,
                );
                logger('Message attempted to broadcast:', transformed);
                return;
            }
        };
    },

    handleOpen() {
        MessageChannel.active = true;
        MessageChannel.publishStateChange({ type: 'active', payload: true });
    },

    handleClose() {
        MessageChannel.active = false;
        MessageChannel.publishStateChange({ type: 'active', payload: false });
    },

    handleMessage(message) {
        // MessageChannel.publishStateChange({ type: 'message', payload: message });
        for (const [key, updatedValue] of Object.entries(message)) {
            const currentValue = MessageChannel[key];

            if (shouldUpdateStateValue(currentValue, updatedValue)) {
                MessageChannel[key] = updatedValue;
                MessageChannel.publishStateChange({
                    type: key,
                    payload: updatedValue,
                });
            }
        }
    },
};

export default MessageChannel;

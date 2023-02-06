const selectFields = (map, fields) =>
    fields.reduce((aggr, field) => {
        if (map[field] !== undefined) {
            aggr[field] = map[field];
        }
        return aggr;
    }, {});

export const eventToView = (event) =>
    selectFields(event, [
        'name',
        'allowAnonymousUsers',
        'tagline',
        'allowRaiseHand',
        'rtcPlayoutDelayHint',
        'customStyles',
        'maxVideoTracks',
    ]);

export const participantToView = (participant) =>
    selectFields(participant, [
        'name',
        'avatarUrl',
        'isHandRaised',
        'primaryRoom',
        'partyRoom',
        'connectionUrl',
        'iceUrl',
        'canSendVideo',
    ]);

export const participantToProfile = (participant) =>
    selectFields(participant, ['id', 'name', 'avatarUrl']);

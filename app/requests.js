import axios from 'axios';

const getConfig = () => ({
    headers: {
        'Content-Type': 'application/json',
        'X-Token': window._authToken,
    },
});

export const signIn = (name) =>
    axios.post('/api/sign-in', { name }, getConfig());

export const joinParty = (roomId) =>
    axios.post('/api/join-party', { roomId }, getConfig());

export const leaveParty = () =>
    axios.post('/api/leave-party', null, getConfig());

export const setHandRaised = (isHandRaised) =>
    axios.post('/api/raise-hand', { isHandRaised }, getConfig());

export const getProfile = (id) =>
    axios.get('/api/profile?id=' + id, getConfig());

export const reportParticipant = (id) =>
    axios.post('/api/report', { id }, getConfig());

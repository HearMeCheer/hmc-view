import PubSub from './PubSub';

const Snackbar = {
    subscribe(callback) {
        return PubSub.subscribe('Snackbar', callback);
    },
    publish({ type, payload }) {
        PubSub.publish('Snackbar', { type, payload });
    },

    emitSuccess(message) {
        Snackbar.publish({
            type: 'message',
            payload: { severity: 'success', message },
        });
    },

    emitError(message) {
        Snackbar.publish({
            type: 'message',
            payload: { severity: 'error', message },
        });
    },
};

export default Snackbar;

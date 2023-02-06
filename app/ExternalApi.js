import PubSub from './PubSub';

const ExternalApi = {
    onStateChange(callback) {
        return PubSub.subscribe('ExternalApi.state', callback);
    },
    publish({ type, payload }) {
        PubSub.publish('ExternalApi.state', { type, payload });
    },
};

export default ExternalApi;

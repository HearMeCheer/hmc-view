import PubSub from './PubSub';

const AuthParticipant = {
    current: null,

    update(value) {
        this.current = value;
        this.publishChange(value);
    },

    publishChange(value) {
        PubSub.publish('AuthParticipant.onChange', value);
    },

    onChange(callback) {
        return PubSub.subscribe('AuthParticipant.onChange', callback);
    },
};

export default AuthParticipant;

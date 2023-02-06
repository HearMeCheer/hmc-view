import debug from 'debug';

const logger = debug('hmc-view:PubSub');

const PubSub = {
    eventMap: new Map(),

    unsubscribe(key, listener) {
        logger.extend(key)('unsubcribe');
        if (PubSub.eventMap.has(key)) {
            const nextValue = PubSub.eventMap
                .get(key)
                .filter((callback) => callback !== listener);
            PubSub.eventMap.set(key, nextValue);
        }
    },

    subscribe(key, listener) {
        logger.extend(key)('subscribe');
        if (!PubSub.eventMap.has(key)) {
            PubSub.eventMap.set(key, [listener]);
        } else {
            PubSub.eventMap.set(key, [...PubSub.eventMap.get(key), listener]);
        }
        return () => PubSub.unsubscribe(key, listener);
    },

    publishSilent(key, ...args) {
        if (PubSub.eventMap.has(key)) {
            const subscribers = PubSub.eventMap.get(key);
            subscribers.forEach((listener) => listener(...args));
        }
    },

    publish(key, ...args) {
        if (PubSub.eventMap.has(key)) {
            const subscribers = PubSub.eventMap.get(key);
            subscribers.forEach((listener) => listener(...args));
            logger.extend(key)('published [%d]', subscribers.length, args);
        } else {
            logger.extend(key)('published [%d]', 0, args);
        }
    },
};

export default PubSub;

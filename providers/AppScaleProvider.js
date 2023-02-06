import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import debug from 'debug';

import { useServerStream } from './ServerStreamProvider';

const logger = debug('hmc-view:ViewScaleProvider');

const APP_WIDTH = 400;
const APP_HEIGHT = 125;
const MIN_SCALE_FACTOR = 0.8;

const getWindowDimensions = () => ({
    x: window.innerWidth,
    y: window.innerHeight,
});

const getElementDimensions = () => ({ x: APP_WIDTH, y: APP_HEIGHT });

const getScaleFactor = () => {
    const { x: windowX, y: windowY } = getWindowDimensions();
    const { x: elementX, y: elementY } = getElementDimensions();

    const scaleX = windowX / elementX;
    const scaleY = windowY / elementY;
    const baseScale = Math.min(scaleX, scaleY); // scale x and y equally
    const scaleFactor = Math.max(baseScale, MIN_SCALE_FACTOR);

    logger('getScaleFactor', {
        windowX,
        windowY,
        elementX,
        elementY,
        scaleX,
        scaleY,
        baseScale,
        scaleFactor,
    });
    return scaleFactor;
};

const AppScaleContext = React.createContext(0);
export const useAppScale = () => React.useContext(AppScaleContext);

export const useScaleTransform = () => {
    const appScale = useAppScale();
    return appScale === 1
        ? { transform: 'none' }
        : { transform: `scale(${appScale})` };
};

const AppScaleProvider = ({ children }) => {
    const { videoTrackCount } = useServerStream();
    const [disableAutoScale, setDisableAutoScale] = useState(false);
    const [scaleFactor, setScaleFactor] = useState(1);

    useEffect(() => {
        setDisableAutoScale(videoTrackCount !== 0);
    }, [videoTrackCount]);

    useEffect(() => {
        if (disableAutoScale) {
            setScaleFactor(1);
            return;
        }
        const callback = () => setScaleFactor(getScaleFactor());
        callback();
        window.addEventListener('resize', callback);
        return () => window.removeEventListener('resize', callback);
    }, [disableAutoScale]);

    return (
        <AppScaleContext.Provider value={scaleFactor}>
            {children}
        </AppScaleContext.Provider>
    );
};

AppScaleProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppScaleProvider;

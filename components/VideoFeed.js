import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import { styled } from '@mui/material';
import debug from 'debug';

import ServerStream from '../app/ServerStream';

const logger = debug('hmc-view:VideoFeed');

const VideoWrapper = styled('div')({
    flex: 1,
    display: 'flex',

    // John can you make this so the video is 'full screen' - lets only assume one video track for now.
    '& > video': {
        width: '100%',
    },
    // '& > video:hover': {
    //     border: '1px solid red',
    //     borderRadius: 4,
    //     zIndex: 1,
    // },
});

const handleError = (err) => {
    if (err.constructor.name !== 'DOMException') {
        console.error('Error occured while trying to play video', err);
    }
};

const VideoFeed = ({ position }) => {
    const elRef = useRef();

    useEffect(() => {
        const videoTrack = ServerStream.getTracks('video')[position];
        logger.extend(position)('video track:', videoTrack);
        if (videoTrack) {
            elRef.current.srcObject = new MediaStream([videoTrack]);
            elRef.current.play().catch(handleError);
        }
    }, [position]);

    return (
        <VideoWrapper>
            <video ref={elRef} playsInline />
        </VideoWrapper>
    );
};

VideoFeed.propTypes = {
    position: PropTypes.number.isRequired,
};

export default VideoFeed;

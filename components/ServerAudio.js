import React, { useEffect, useRef } from 'react';

import ServerStream from '../app/ServerStream';
import { useServerStream } from '../providers/ServerStreamProvider';

const ServerAudio = () => {
    const elementRef = useRef(null);
    const serverStream = useServerStream();

    useEffect(() => {
        if (serverStream.audioTrackCount > 0) {
            try {
                const audioTracks = ServerStream.getTracks('audio');
                const element = elementRef.current;
                element.srcObject = new MediaStream([...audioTracks]);
                element.play();
            } catch (err) {
                console.error(err);
                // do nothing
            }
        }
    }, [serverStream.audioTrackCount]);

    useEffect(() => {
        elementRef.current.volume = serverStream.audioVolume / 100;
    }, [serverStream.audioVolume]);

    return <audio ref={elementRef} />;
};

export default ServerAudio;

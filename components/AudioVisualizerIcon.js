import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import LocalStream from '../app/LocalStream';
import { useLocalStream } from '../providers/LocalStreamProvider';

const primaryColour = '#ee0067';

const avg = (arr) => {
    let sum = 0;
    for (const n of arr) {
        sum += n;
    }
    return sum / arr.length;
};

const makeAudioAnalyser = (mediaStream) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContext();
    const audioSource = audio.createMediaStreamSource(mediaStream);

    const analyserNode = audio.createAnalyser();
    analyserNode.fftSize = 256;
    audioSource.connect(analyserNode);

    return analyserNode;
};

const getBarValuesFromAnalyser = (analyserNode) => {
    const frequencyData = new Uint8Array(128);
    analyserNode.getByteFrequencyData(frequencyData);

    // bar 1: bucket: 0
    // bar 2: buckets: 1 - 5
    // bar 3: buckets: 6 - 16
    return [
        frequencyToDecimal(frequencyData[0]),
        frequencyToDecimal(avg(frequencyData.slice(1, 6))),
        frequencyToDecimal(avg(frequencyData.slice(6, 17))),
    ];
};

const frequencyToDecimal = (freq) => {
    // convert the frequency (range 0 - 255) into a percent value
    // represented by a decimal (range 0 - 1)
    return freq / 255 + 0.1;
};

const AudioVisualizerIcon = ({ dimension }) => {
    const localStream = useLocalStream();
    const [analyserNode, setAnalyserNode] = useState(null);
    const [barValues, setBarValues] = useState([1, 1, 1]);
    const animationRequestRef = useRef(null);

    // listen for the event and ask for audio input stream when ready
    useEffect(() => {
        // disable visualizations for safari on iOS
        // https://stackoverflow.com/questions/59866930/web-audio-api-not-playing-on-ios-version-13-3-works-on-older-versions-of-ios
        const { userAgent } = window.navigator;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            return;
        }

        if (localStream.usingMicrophone) {
            setAnalyserNode(
                // makeAudioAnalyser(new MediaStream([LocalStream.audioTrack])),
                makeAudioAnalyser(
                    new MediaStream(
                        LocalStream.getMediaStream().getAudioTracks(),
                    ),
                ),
            );
            return () => setAnalyserNode(null);
        }
    }, [localStream.usingMicrophone]);

    const updateAudioVisuals = useCallback(() => {
        if (!localStream.usingMicrophone) {
            setBarValues([1, 1, 1]);
            return;
        }
        if (!localStream.audioEnabled) {
            setBarValues([0.1, 0.1, 0.1]);
            return;
        }
        animationRequestRef.current = requestAnimationFrame(updateAudioVisuals);
        setBarValues(getBarValuesFromAnalyser(analyserNode));
    }, [localStream.usingMicrophone, localStream.audioEnabled, analyserNode]);

    useEffect(() => {
        if (analyserNode !== null) {
            updateAudioVisuals();
            return () => cancelAnimationFrame(animationRequestRef.current);
        }
    }, [analyserNode, updateAudioVisuals]);

    const [bar1Value, bar2Value, bar3Value] = barValues;
    return (
        <svg width={dimension} height={dimension} viewBox="0 0 80 80">
            <path
                id="bar1"
                transform="translate(12.5, 18)"
                d="M12.34,6.17a6.17,6.17,0,1,0-9.75,5,2.89,2.89,0,0,1,.71,1.9,2.92,2.92,0,0,1-1.19,2.35h0A6.15,6.15,0,0,0,0,20.07c0,.07,0,.15,0,.22H0V37.74a6.17,6.17,0,0,0,12.34,0V20.28h0c0-.07,0-.15,0-.22a6.19,6.19,0,0,0-2.24-4.75,2.89,2.89,0,0,1-1-2.23,2.86,2.86,0,0,1,.76-1.95A6.19,6.19,0,0,0,12.34,6.17Z"
            />
            <clipPath id="bar1Fill" clipPathUnits="objectBoundingBox">
                <rect y={0.5 - bar1Value / 2} width={1} height={bar1Value} />
            </clipPath>
            <use
                clipPath="url(#bar1Fill)"
                xlinkHref="#bar1"
                fill={primaryColour}
            />

            <path
                id="bar2"
                transform="translate(34, 6)"
                d="M12.34,6.17a6.17,6.17,0,1,0-9.8,5,2.92,2.92,0,0,1,.75,1.95,2.89,2.89,0,0,1-.79,2A6.15,6.15,0,0,0,0,20V62.34a6.17,6.17,0,1,0,12.34,0V20a6.17,6.17,0,0,0-2.51-5,2.85,2.85,0,0,1,0-3.9A6.18,6.18,0,0,0,12.34,6.17Z"
            />
            <clipPath id="bar2Fill" clipPathUnits="objectBoundingBox">
                <rect y={0.5 - bar2Value / 2} width={1} height={bar2Value} />
            </clipPath>
            <use
                clipPath="url(#bar2Fill)"
                xlinkHref="#bar2"
                fill={primaryColour}
            />

            <path
                id="bar3"
                transform="translate(56, 23)"
                d="M10.11,15.24a3,3,0,0,1-1-2.18,2.91,2.91,0,0,1,.81-2A6.16,6.16,0,0,0,6.17,0h0A6.18,6.18,0,0,0,0,6s0,.1,0,.16a6.17,6.17,0,0,0,2.8,5.16,3,3,0,0,1,.57,1.73,2.81,2.81,0,0,1-.65,1.8A6.2,6.2,0,0,0,0,19.81c0,.05,0,.1,0,.16H0v8.12a6.18,6.18,0,0,0,6.17,6.16h0a6.18,6.18,0,0,0,6.17-6.16V20h0A6.14,6.14,0,0,0,10.11,15.24Z"
            />
            <clipPath id="bar3Fill" clipPathUnits="objectBoundingBox">
                <rect y={0.5 - bar3Value / 2} width={1} height={bar3Value} />
            </clipPath>
            <use
                clipPath="url(#bar3Fill)"
                xlinkHref="#bar3"
                fill={primaryColour}
            />
        </svg>
    );
};

AudioVisualizerIcon.propTypes = {
    dimension: PropTypes.number.isRequired,
};
AudioVisualizerIcon.defaultProps = {
    dimension: 58,
};

export default AudioVisualizerIcon;

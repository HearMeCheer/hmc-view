import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IconButton, Slider, Stack, styled } from '@mui/material';

const Content = styled(Stack)({
    width: 300,
    flexGrow: 1,
});

const MODIFIER = 1;

const VolumeSlider = (props) => {
    const { value, onChange } = props;
    const [sliderValue, setSliderValue] = useState(0);

    const changeVolume = useCallback(
        (value) => {
            if (onChange) {
                onChange(value / MODIFIER);
            }
        },
        [onChange],
    );

    // initialize and sync the slider value to the prop value
    useEffect(() => {
        if (typeof value === 'number') {
            setSliderValue(value * MODIFIER);
        }
    }, [value]);

    // sync back to sliderValue to value without spamming network
    useEffect(() => {
        if (sliderValue !== value) {
            const timerId = setTimeout(() => changeVolume(sliderValue), 500);
            return () => clearTimeout(timerId);
        }
    }, [changeVolume, sliderValue, value]);

    const noVolume = useCallback(() => {
        changeVolume(0);
    }, [changeVolume]);

    const maxVolume = useCallback(() => {
        changeVolume(100);
    }, [changeVolume]);

    const handleSliderChange = useCallback(
        (e, value) => setSliderValue(value),
        [],
    );

    return (
        <Content direction="row" spacing={2} alignItems="center">
            <IconButton onClick={noVolume}>
                <VolumeOffIcon />
            </IconButton>
            <Slider value={sliderValue} onChange={handleSliderChange} />
            <IconButton onClick={maxVolume}>
                <VolumeUpIcon />
            </IconButton>
        </Content>
    );
};

VolumeSlider.propTypes = {
    value: PropTypes.number, // [0-1]
    onChange: PropTypes.func,
};

export default VolumeSlider;

import PropTypes from 'prop-types';
import React from 'react';

import { Popper, Tooltip } from '@mui/material';

import { useScaleTransform } from '../providers/AppScaleProvider';

const PopperWrapper = (props) => {
    const scaleTransform = useScaleTransform();
    return (
        <div {...props} style={{ ...scaleTransform, pointerEvents: 'none' }} />
    );
};

const ScalingPopper = ({ children, ...popperProps }) => (
    <Popper {...popperProps}>
        {(...args) => <PopperWrapper>{children(...args)}</PopperWrapper>}
    </Popper>
);
ScalingPopper.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

const ScalingTooltip = (props) => (
    <Tooltip {...props} PopperComponent={ScalingPopper} />
);

export default ScalingTooltip;

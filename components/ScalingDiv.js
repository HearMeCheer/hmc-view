import PropTypes from 'prop-types';
import React from 'react';

import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import { useScaleTransform } from '../providers/AppScaleProvider';

const UnstyledScalingDiv = ({ Component, className, ...props }) => {
    const scaleTransform = useScaleTransform();
    return (
        <Component
            {...props}
            style={scaleTransform}
            className={clsx('HmcScalingDiv-root', { [className]: className })}
        />
    );
};

UnstyledScalingDiv.propTypes = {
    Component: PropTypes.node,
};
UnstyledScalingDiv.defaultProps = {
    Component: 'div',
};

const ScalingDiv = styled(UnstyledScalingDiv)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    padding: theme.spacing(1, 2),
}));

export default ScalingDiv;

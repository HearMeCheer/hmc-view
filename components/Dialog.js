import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { Grow } from '@mui/material';
import { styled } from '@mui/material/styles';

import Tagline from './Tagline';

const AUTO_CLOSE_DELAY = 4500;

const Backdrop = styled('div', {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    // background: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: theme.zIndex.drawer + 1,
    visibility: open ? 'visible' : 'hidden',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
    width: 350,
    height: 54,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: 1000,
    zIndex: 1,
}));

const Dialog = ({ open, onClose, children, tagline, disableGrow }) => {
    const [lastUserEvent, setLastUserEvent] = useState(new Date());

    useEffect(() => {
        if (open && lastUserEvent) {
            const timerId = setTimeout(onClose, AUTO_CLOSE_DELAY);
            return () => clearTimeout(timerId);
        }
    }, [open, onClose, lastUserEvent]);

    const handleContentClick = useCallback((e) => {
        e.stopPropagation();
        setLastUserEvent(new Date());
    }, []);

    const handleContentKeyDown = useCallback(() => {
        setLastUserEvent(new Date());
    }, []);

    const handleAppBlur = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        window.addEventListener('blur', handleAppBlur);
        return () => window.removeEventListener('blur', handleAppBlur);
    }, [handleAppBlur]);

    return (
        <Backdrop className="HmcDialog-Backdrop" open={open} onClick={onClose}>
            {tagline && <Tagline>{tagline}</Tagline>}
            <Grow in={open} appear={!disableGrow}>
                <ContentWrapper
                    className="HmcDialog-Paper"
                    onClick={handleContentClick}
                    onKeyDown={handleContentKeyDown}
                >
                    {children}
                </ContentWrapper>
            </Grow>
        </Backdrop>
    );
};

Dialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node,
    tagline: PropTypes.string,
    disableGrow: PropTypes.bool,
};

export default Dialog;

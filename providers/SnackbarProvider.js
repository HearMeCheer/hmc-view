import PropTypes from 'prop-types';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react';

import { Alert, Snackbar as MuiSnackbar } from '@mui/material';

import Snackbar from '../app/Snackbar';
import { useScaleTransform } from './AppScaleProvider';

const initialContext = {
    open: false,
    severity: 'info',
    message: null,
};

const contextReducer = (state, { type, payload }) => {
    switch (type) {
        case 'message':
            return {
                open: true,
                severity: payload.severity,
                message: payload.message,
            };
        case 'reset':
            return { ...initialContext };
    }
};

const SnackbarProvider = ({ children }) => {
    const scaleTransform = useScaleTransform();
    const [context, dispatch] = useReducer(contextReducer, initialContext);

    const { open, severity, message } = context;

    useEffect(() => {
        return Snackbar.subscribe(dispatch);
    }, []);

    const handleClose = useCallback(() => {
        dispatch({ type: 'reset' });
    }, []);

    return (
        <>
            <MuiSnackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={4000}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    style={{
                        ...scaleTransform,
                        transformOrigin: 'bottom left',
                    }}
                >
                    {message}
                </Alert>
            </MuiSnackbar>
            {children}
        </>
    );
};

SnackbarProvider.propTypes = {
    children: PropTypes.any,
};
SnackbarProvider.defaultProps = {};

export default SnackbarProvider;

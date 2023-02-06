import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { Input as MuiInput, styled } from '@mui/material';

const Input = ({ onSubmit, ...inputProps }) => {
    const handleKeyDown = useCallback(
        (e) => {
            const keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                onSubmit(e.target.value);
            }
        },
        [onSubmit],
    );

    return (
        <MuiInput
            {...inputProps}
            onKeyDown={onSubmit ? handleKeyDown : null}
            disableUnderline={true}
        />
    );
};

Input.propTypes = {
    onSubmit: PropTypes.func,
};

const TextField = styled(Input)(({ theme }) => ({
    background: '#f5f5f5',
    borderRadius: 1000,
    padding: theme.spacing(1),
    '& > div': {
        borderRadius: 1000,
    },
}));

export default TextField;

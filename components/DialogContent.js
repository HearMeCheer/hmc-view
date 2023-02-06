import React from 'react';

import { Stack, styled } from '@mui/material';
import clsx from 'clsx';

const UnstyledDialogContent = ({ className, ...props }) => (
    <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        {...props}
        className={clsx('HmcDialog-Content', { [className]: className })}
    />
);

const DialogContent = styled(UnstyledDialogContent)(({ theme }) => ({
    flexGrow: 1,
    borderRadius: 1000,
    margin: theme.spacing(0.5),
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    overflow: 'hidden',
}));

export default DialogContent;

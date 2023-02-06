import React from 'react';

import { Badge as MuiBadge } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const UnstyledBadge = ({ className, ...props }) => (
    <MuiBadge
        color="primary"
        className={clsx('HmcBadge-root', { [className]: className })}
        {...props}
    />
);

const Badge = styled(UnstyledBadge)({
    '& .MuiBadge-badge': {
        top: 8,
        right: 8,
    },
});

export default Badge;

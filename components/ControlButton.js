import { IconButton, styled } from '@mui/material';
import clsx from 'clsx';

const UnstyledControlButton = ({ className, ...props }) => (
    <IconButton
        className={clsx('HmcControlButton-root', { [className]: className })}
        {...props}
    />
);

const ControlButton = styled(UnstyledControlButton, {
    shouldForwardProp: (prop) => prop !== 'inactive',
})(({ theme, inactive }) => ({
    width: theme.spacing(6),
    height: theme.spacing(6),
    zIndex: 1,

    boxShadow: theme.shadows[2],
    background: theme.palette.background.paper,
    borderRadius: 1000,

    '&:hover': {
        background: theme.palette.common.white,
    },

    '& > svg': {
        width: '80%',
        height: '80%',
    },

    ...(inactive && {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,

        '&:hover': {
            background: theme.palette.primary.light,
        },
    }),
}));

export default ControlButton;

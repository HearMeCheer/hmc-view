import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const UnstyledTagline = ({ className, ...props }) => (
    <Typography
        {...props}
        component="div"
        variant="body2"
        className={clsx('HmcTagline-root', { [className]: className })}
    />
);

const Tagline = styled(UnstyledTagline)(({ theme }) => ({
    background: 'black',
    color: 'white',
    padding: theme.spacing(0.25, 0.5),
    borderRadius: '1000px 1000px 0 1000px',
    textTransform: 'uppercase',
    // fontSize: '.675rem',
}));

export default Tagline;

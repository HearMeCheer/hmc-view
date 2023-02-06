import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const PrimaryButton = styled(IconButton)(({ theme }) => ({
    background: theme.palette.green.main,
    color: '#fff',
    '&:hover': {
        background: theme.palette.green.light,
    },
}));

export default PrimaryButton;

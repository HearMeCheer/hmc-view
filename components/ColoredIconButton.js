import { IconButton, styled } from '@mui/material';

const ColoredIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => !['color', 'textColor'].includes(prop),
})(({ color, textColor = '#fff' }) => ({
    color: textColor,
    background: color,
}));

export default ColoredIconButton;

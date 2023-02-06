import { lighten } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        htmlFontSize: 16,
        h1: {
            // fontSize: '2.2rem',
            textTransform: 'uppercase',
            // letterSpacing: '.08em',
        },
        h2: {
            // fontSize: '2rem',
            textTransform: 'uppercase',
            // letterSpacing: '.09em',
        },
        h3: {
            // fontSize: '1.6rem',
            textTransform: 'uppercase',
            // letterSpacing: '.09em',
        },
        h4: {
            // fontSize: '1.4rem',
            textTransform: 'uppercase',
            // letterSpacing: '.09em',
        },
        h5: {
            // fontSize: '1rem',
            textTransform: 'uppercase',
            // letterSpacing: '.09em',
        },
        h6: {
            // fontSize: '.9rem',
            textTransform: 'uppercase',
            // letterSpacing: '.09em',
        },
        overline: {
            // fontSize: '.9rem',
            textTransform: 'uppercase',
            // letterSpacing: '.09em',
        },
        caption: {
            // fontSize: '.9rem',
            textTransform: 'uppercase',
            // letterSpacing: '.090em',
        },
        button: {
            // fontSize: '.9rem',
            // fontWeight: 'bold',
            textTransform: 'uppercase',
            // letterSpacing: '.16em',
        },
        body1: {
            // fontSize: '1rem',
            // letterSpacing: '.070em',
        },
        body2: {
            // fontSize: '.9rem',
            // letterSpacing: '.070em',
        },
    },
    palette: {
        primary: {
            main: '#E32C6D',
        },
        secondary: {
            main: '#7E4072',
        },
        text: {
            primary: '#707070',
            secondary: '#aaa',
        },
        background: {
            default:
                process.env.NODE_ENV === 'development' ? '#efefef' : 'none',
        },
        green: {
            main: '#08BE82',
            light: lighten('#08BE82', 0.3),
            dark: '#088B61',
        },
        blue: {
            main: '#0063B1',
            light: lighten('#0063B1', 0.3),
        },
    },
    shape: {
        borderRadius: 6,
    },
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    marginTop: '2px !important',
                },
            },
        },
    },
});

export default theme;

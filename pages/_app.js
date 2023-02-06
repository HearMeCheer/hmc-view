import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';

import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { SWRConfig } from 'swr';

import createEmotionCache from '../app/createEmotionCache';
import swrConfig from '../app/swrConfig';
import theme from '../app/theme';
import '../styles.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = ({
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
}) => (
    <SWRConfig value={swrConfig}>
        <CacheProvider value={emotionCache}>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </CacheProvider>
    </SWRConfig>
);

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};

export default App;

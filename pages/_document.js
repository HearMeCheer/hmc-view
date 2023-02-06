import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import createEmotionServer from '@emotion/server/create-instance';

import createEmotionCache from '../app/createEmotionCache';
import theme from '../app/theme';

const Document = ({ emotionStyleTags }) => (
    <Html lang="en">
        <Head>
            {/* PWA primary color */}
            <meta name="theme-color" content={theme.palette.primary.main} />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            {/* Inject MUI styles first to match with the prepend: true configuration. */}
            {emotionStyleTags}
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
);

export const getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await NextDocument.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};

export default Document;

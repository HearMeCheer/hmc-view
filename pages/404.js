import Head from 'next/head';

const Page404 = () => (
    <>
        <Head>
            <title>404 | {process.env.NEXT_PUBLIC_APP_NAME}</title>
        </Head>
        <div>
            <strong>404</strong> | Page was deleted or no longer exists
        </div>
    </>
);

export default Page404;

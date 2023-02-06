const Home = () => 'Redirecting...';

export const getServerSideProps = () => {
    return {
        redirect: {
            destination:
                process.env.NODE_ENV === 'development'
                    ? '/test-property/test-event'
                    : process.env.APP_REDIRECT_URL,
            permanent: false,
        },
    };
};

export default Home;

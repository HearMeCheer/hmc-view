const IframePage = () => (
    <>
        <iframe
            id="hmc-app"
            src="/test-property/test-event"
            style={{ flex: 1, width: '100%' }}
        />
        <script src="/assets/test-property/test-event/init.js" async defer />
    </>
);

export default IframePage;

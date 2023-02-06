import { withSessionSsr } from '../../app/session';
import PreDiv from '../../components/PreDiv';

const SessionPage = ({ session }) => (
    <PreDiv>{JSON.stringify(session, null, 4)}</PreDiv>
);

export default SessionPage;

const _getServerSideProps = ({ req: { session } }) => {
    return { props: { session } };
};

export const getServerSideProps = withSessionSsr(_getServerSideProps);

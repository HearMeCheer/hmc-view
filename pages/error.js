import PropTypes from 'prop-types';

import { Stack } from '@mui/material';

import PreDiv from '../components/PreDiv';

const ErrorMessage = ({ status, message }) => (
    <Stack>
        <PreDiv>{JSON.stringify({ status, message }, null, 4)}</PreDiv>
    </Stack>
);

ErrorMessage.propTypes = {
    status: PropTypes.string,
    message: PropTypes.string,
};
export default ErrorMessage;

export const getServerSideProps = ({ query: { status, message } }) => ({
    props: {
        status: status || '500',
        message: message || 'An error has occurred',
    },
});

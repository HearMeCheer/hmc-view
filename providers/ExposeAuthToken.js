import { useEffect } from 'react';

const ExposeAuthToken = ({ authToken, children }) => {
    useEffect(() => {
        window._authToken = authToken;
    }, [authToken]);
    return children;
};

export default ExposeAuthToken;

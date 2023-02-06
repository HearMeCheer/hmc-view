import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const Compose = ({ components, children }) => (
    <Fragment>
        {components
            .slice()
            .reverse()
            .reduce((aggr, curr) => {
                const [Provider, props] = Array.isArray(curr)
                    ? [curr[0], curr[1]]
                    : [curr, {}];
                return <Provider {...props}>{aggr}</Provider>;
            }, children)}
    </Fragment>
);

Compose.propTypes = {
    components: PropTypes.array,
    children: PropTypes.node,
};

export default Compose;

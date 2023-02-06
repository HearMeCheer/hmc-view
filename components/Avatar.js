import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Avatar } from '@mui/material';

const getFirstChar = (str) => {
    // 1114111 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_a_codepoint
    let codePoint = str.codePointAt(0);
    if (
        codePoint === undefined ||
        Number.isNaN(codePoint) ||
        codePoint < 0 ||
        codePoint > 1114111
    ) {
        return '?';
    }
    return String.fromCodePoint(codePoint); // this will throw with invalid code points
};

const UserAvatar = React.forwardRef(function UserAvatar(props, ref) {
    const { name, icon, ...avatarProps } = props;
    const [initials, setInitials] = useState('');

    useEffect(() => {
        if (!name || !name.length) {
            return;
        }
        const nameParts = name.toUpperCase().trim().split(' ');
        let initials = getFirstChar(nameParts[0]);
        if (nameParts.length > 1 && nameParts[1].length) {
            initials += getFirstChar(nameParts[1]);
        }
        setInitials(initials);
    }, [name]);

    return (
        <Avatar {...avatarProps} ref={ref}>
            {icon || initials}
        </Avatar>
    );
});

UserAvatar.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.element,
};
UserAvatar.defaultProps = {
    name: '',
};

export default UserAvatar;

import React, { useEffect, useState } from 'react';

import { Audiotrack as AudioIcon } from '@mui/icons-material';

import { getProfile } from '../app/requests';

const cache = {
    background: { name: 'Room Audio', icon: <AudioIcon />, isSystem: true },
};

const useParticipantProfile = (id) => {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        if (!id) {
            return;
        }
        if (cache[id]) {
            setProfile(cache[id]);
            return;
        }
        getProfile(id).then((response) => {
            setProfile(response.data);
            cache[id] = response.data;
        });
    }, [id]);

    return profile;
};
export default useParticipantProfile;

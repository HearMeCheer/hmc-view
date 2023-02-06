import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { IosShare as ShareIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import Snackbar from '../app/Snackbar';
import { useExternalContext } from '../providers/ExternalApiProvider';
import { useParticipant } from '../providers/ParticipantProvider';
import ScalingTooltip from './ScalingTooltip';

const ShareButton = ({ onShare }) => {
    const { parentHref } = useExternalContext();
    const { partyRoom } = useParticipant();
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (parentHref) {
            const url = new URL(parentHref);
            url.searchParams.set('hmc-roomId', partyRoom);
            setShareUrl(url.toString());
        } else {
            setShareUrl(partyRoom);
        }
    }, [parentHref, partyRoom]);

    const openSystemShare = useCallback(() => {
        navigator.share({ url: shareUrl });
        onShare(onShare);
    }, [onShare, shareUrl]);

    const copyUrlToClipboard = useCallback(async () => {
        await navigator.clipboard.writeText(shareUrl);
        Snackbar.emitSuccess('URL Copied to Clipboard');
        onShare();
    }, [onShare, shareUrl]);

    if (typeof navigator.share !== 'undefined') {
        return (
            <IconButton onClick={openSystemShare}>
                <ShareIcon />
            </IconButton>
        );
    }
    return (
        <ScalingTooltip title="Copy To Clipboard">
            <IconButton onClick={copyUrlToClipboard}>
                <ShareIcon />
            </IconButton>
        </ScalingTooltip>
    );
};

ShareButton.propTypes = {
    shareUrl: PropTypes.string,
    onShare: PropTypes.func,
};

export default ShareButton;

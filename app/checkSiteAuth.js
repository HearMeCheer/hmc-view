import debug from 'debug';

import { getViewSettings, updateViewSettings } from './HmcApi';

const logger = debug('hmc-view:checkSiteAuth');

const checkSiteAuth = async (propertyId, referer) => {
    logger('Looking up view settings');
    const [err, settings] = await getViewSettings({ propertyId });
    if (err && err.status !== 404) throw err;

    // invalid Property id
    if (!settings) {
        logger(
            'validation failed: no settings found for Property [%s]',
            propertyId,
        );
        return [404];
    }
    logger("Found Property's embed settings");

    if (
        process.env.BYPASS_REFERER_AUTH === '1' ||
        settings.disableSiteRestrictions
    ) {
        logger('validation passed: Site restrictions disabled');
        return [200];
    }

    if (!referer) {
        logger('validation failed: No Referrer Provided');
        return [400, 'No Referrer Provided'];
    }
    const { origin } = new URL(referer);
    logger('Request Origin:', origin);

    if (settings.blockedSites.includes(origin)) {
        logger('validation failed: Site has been blocked');
        return [403, 'Forbidden'];
    }

    if (origin === process.env.HMC_ADMIN_URL) {
        logger('validation passed: Site is from HMC Admin');
        return [200];
    }

    if (settings.allowedSites.includes(origin)) {
        logger('validation passed: Site has been granted access');
        return [200];
    }

    if (!settings.unlistedSites.includes(origin)) {
        logger('validation failed: unlisted - Recording site usage');
        await updateViewSettings(
            { propertyId },
            { unlistedSites: [...settings.unlistedSites, origin] },
        );
    } else {
        logger('validation failed: unlisted - Origin already recorded');
    }

    return [401, 'Unauthorized Site'];
};

export default checkSiteAuth;

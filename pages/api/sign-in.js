import debug from 'debug';

import { updateParticipant } from '../../app/HmcApi';
import { participantToView } from '../../app/transformers';
import withApiMiddleware from '../../app/withApiMiddleware';

const logger = debug('hmc-view:SignIn');

const SignIn = async ({ auth: participantContext, body }, res) => {
    if (!participantContext) {
        res.status(403).json({ message: 'Session Expired' });
        return;
    }
    logger('called with participantContext:', participantContext);

    logger('name change detected, previous was:', participantContext.name);
    if (!body.name || body.name.length < 1) {
        res.status(422).json({
            message: 'Your display name must have at least 1 character',
        });
        return;
    }

    const [err, participant] = await updateParticipant(participantContext, {
        name: body.name,
    });
    if (err) {
        res.status(err.status).json({ message: err.message });
        return;
    }

    res.status(200).json(participantToView(participant));
};

export default withApiMiddleware(SignIn);

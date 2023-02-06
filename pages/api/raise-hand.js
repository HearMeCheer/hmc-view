import { updateParticipant } from '../../app/HmcApi';
import { participantToView } from '../../app/transformers';
import withApiMiddleware from '../../app/withApiMiddleware';

const RaiseHand = async (
    { auth: participantContext, body: { isHandRaised } },
    res,
) => {
    if (!participantContext) {
        res.status(403).json({ message: 'Session Expired' });
        return;
    }
    const [err, participant] = await updateParticipant(participantContext, {
        isHandRaised,
    });
    if (err) res.status(err.status).end({ message: err.message });
    else res.status(200).json(participantToView(participant));
};

export default withApiMiddleware(RaiseHand);

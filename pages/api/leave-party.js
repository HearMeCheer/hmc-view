import { leaveParty } from '../../app/HmcApi';
import { participantToView } from '../../app/transformers';
import withApiMiddleware from '../../app/withApiMiddleware';

const LeaveParty = async ({ auth: participantContext }, res) => {
    if (!participantContext) {
        res.status(403).json({ message: 'Session Expired' });
        return;
    }
    const [err, participant] = await leaveParty(participantContext);
    if (err) res.status(err.status).send({ message: err.message });
    else res.status(200).send(participantToView(participant));
};

export default withApiMiddleware(LeaveParty);

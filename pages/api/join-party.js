import { joinParty } from '../../app/HmcApi';
import generateUnqiuePartyName from '../../app/generateUniquePartyName';
import { participantToView } from '../../app/transformers';
import withApiMiddleware from '../../app/withApiMiddleware';

const JoinParty = async (
    { auth: participantContext, body: { roomId } },
    res,
) => {
    if (!participantContext) {
        res.status(403).json({ message: 'Session Expired' });
        return;
    }
    const [err, participant] = await joinParty({
        ...participantContext,
        roomId: roomId || generateUnqiuePartyName(),
    });
    if (err) res.status(err.status).json({ message: err.message });
    else res.status(200).send(participantToView(participant));
};

export default withApiMiddleware(JoinParty);

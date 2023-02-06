import { getParticipant } from '../../app/HmcApi';
import { participantToProfile } from '../../app/transformers';
import withApiMiddleware from '../../app/withApiMiddleware';

const Profile = async ({ auth: participantContext, query: { id } }, res) => {
    if (!participantContext) {
        res.status(403).json({ message: 'Session Expired' });
        return;
    }
    const [err, participant] = await getParticipant({
        propertyId: participantContext.propertyId,
        eventId: participantContext.eventId,
        participantId: id,
    });
    if (err) res.status(err.status).end({ message: err.message });
    else res.status(200).json(participantToProfile(participant));
};

export default withApiMiddleware(Profile);

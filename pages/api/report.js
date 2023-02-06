import { getParticipant, updateParticipant } from '../../app/HmcApi';
import withApiMiddleware from '../../app/withApiMiddleware';

const Report = async ({ auth: participantContext, body: { id } }, res) => {
    if (!participantContext) {
        res.status(403).json({ message: 'Session Expired' });
        return;
    }

    const targetContext = { ...participantContext, participantId: id };

    const [err, participant] = await getParticipant(targetContext);
    if (err) throw err;

    const [updateErr] = await updateParticipant(targetContext, {
        reports: [
            ...participant.reports,
            {
                issuerId: participantContext.participantId,
                time: new Date(),
            },
        ],
    });
    if (updateErr) throw updateErr;

    res.status(200).json({ message: 'Report Sent' });
};

export default withApiMiddleware(Report);

import AppProviders from '../providers/AppProviders';
import AppStack from './AppStack';
import AuthContent from './AuthContent';
import BroadcastMessages from './BroadcastMessages';
import JoinEventDialog from './JoinEventDialog';
import ScalingDiv from './ScalingDiv';
import ServerAudio from './ServerAudio';
import ServerVideo from './ServerVideo';

const AppRoot = ({ authToken, event, participant }) => (
    <AppProviders authToken={authToken} event={event} participant={participant}>
        <AuthContent>
            <ServerVideo />
            <ServerAudio />
            <ScalingDiv Component="main">
                <AppStack />
                <BroadcastMessages />
                <JoinEventDialog />
            </ScalingDiv>
        </AuthContent>
    </AppProviders>
);

export default AppRoot;

import React from 'react';

import { styled } from '@mui/material';

import { useServerStream } from '../providers/ServerStreamProvider';
import VideoFeed from './VideoFeed';

const GridWrapper = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

// const Grid = styled('div')(({ theme }) => ({
//     display: 'grid',
//     gridTemplateColumns: '50% 50%',
//     gridTemplateRows: '50% 50%',
//     width: '100vw',
//     height: 'auto',
//     // placeItems: 'center',
//     // alignItems: 'center',
//     // justifyItems: 'stretch',

//     [theme.breakpoints.down('sm')]: {
//         // gridTemplateColumns: '50% 50%',
//         // gridTemplateRows: 'repeat(2, 1fr)',
//         height: 'auto',
//     },

//     '& > video': {
//         width: '100%',
//     },
//     '& > video:hover': {
//         border: '1px solid red',
//         borderRadius: 4,
//         zIndex: 1,
//     },
// }));

// const VideoGrid = ({ count }) => (
//     <GridWrapper>
//         <Grid>
//             {[...Array(count)].reverse().map((_, position) => (
//                 <VideoFeed key={position} position={position} />
//             ))}
//         </Grid>
//     </GridWrapper>
// );

// VideoGrid.propTypes = {
//     count: PropTypes.number.isRequired,
// };

const ServerVideo = () => {
    const { videoTrackCount } = useServerStream();
    if (videoTrackCount === 0) {
        return null;
    }
    // return <VideoGrid count={videoTrackCount} className="HmcVideo-Grid" />;
    return (
        <GridWrapper>
            <VideoFeed position={0} />
        </GridWrapper>
    );

    // return <VideoFeed position={0} />;

    // const [ready, setReady] = useState(false);
    // useEffect(() => {
    //     LocalStream.make().then(() => setReady(true));
    // }, []);

    // if (!ready) return null;
    // return <VideoGrid count={4} />;
};

export default ServerVideo;

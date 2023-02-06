import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

// used by all SWR hooks inside that SWRConfig boundary
const swrConfig = {
    provider: () => new Map(),
    fetcher,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export default swrConfig;

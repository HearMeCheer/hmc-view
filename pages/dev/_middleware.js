import { NextResponse } from 'next/server';

import makeUrl from '../../app/makeUrl';

const devEnvironmentOnlyMiddleware = () => {
    if (process.env.NEXT_PUBLIC_APP_ENV !== 'development') {
        return NextResponse.rewrite(makeUrl('/404'));
    }
    return NextResponse.next();
};

export default devEnvironmentOnlyMiddleware;

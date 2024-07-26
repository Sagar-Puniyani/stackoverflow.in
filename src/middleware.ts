import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import GetOrCreateDB from './models/server/dbSetup';
import getOrCreateStorage from './models/server/storage.setup';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    await Promise.all([
        GetOrCreateDB(),
        getOrCreateStorage()
    ])
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    /*match all the request path except for that ones that strats with:
    -api
    -_next/stactic
    -_next/image
    -favicon
     */
    matcher: [
        '/((?!api|_next/static|_next/image|favicon).*)',
    ],
}
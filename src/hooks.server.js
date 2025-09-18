import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { goto } from '$app/navigation';
import { verify } from '$lib/server/cookies';
import { redirect } from '@sveltejs/kit';
import jwt from "jsonwebtoken"


const authRoutes = [
    '/profile',
    '/community'
]

const isAuthRoute = (pathName, routes) => {
    return routes.some(route =>
        pathName === route || pathName.startsWith(`${route}/`)
    )
}

export const handle = sequence(async ({ event, resolve }) => {

    const cookie = event.cookies.get('acs_tkn')
    const rCookie = event.cookies.get('rfh_tkn')

    const acsTkn = cookie ? verify(cookie) : null



	if (isAuthRoute(event.url.pathname, authRoutes)) {

        if (!rCookie){
            redirect(303, '/auth/login', {invalidateAll: true})
            return resolve(event)
        }

        if (!acsTkn) {
            return resolve(event)
        }

        try {
            if(jwt.verify(acsTkn, "12345")) {
                event.locals.token = acsTkn
            }
        } catch (err) {
            console.log(err)
            if (err instanceof jwt.TokenExpiredError) {console.log('token expired')
                //return resolve(event)
            }
            else if (err instanceof jwt.NotBeforeError || err instanceof jwt.JsonWebTokenError) {
                console.log(err)
                delete event.locals.token
                event.cookies.delete('rfh_tkn', {'path': '/'})
                event.cookies.delete('acs_tkn', {'path': '/'})
                redirect(303, '/auth/login', {invalidateAll: true})
                //return resolve(event)
            }
        }
	}

    console.log(event.url.pathname.startsWith('/community/news/'))

    if ((event.url.pathname.startsWith('/community/news/') || (event.url.pathname === '/community/news')) ||
        event.url.pathname.startsWith('/community/updates')
    ) {
        const restOfRoute = event.url.pathname
        console.log(86776)
        await redirect (308, '/community/news-and-updates/')
    }
	const response = await resolve(event);
	return response;
});


export const handleError = Sentry.handleErrorWithSentry();
import { verify } from '$lib/server/cookies';


const authRoutes = [
    '/profile',
    '/community'
]

const isAuthRoute = (pathName, routes) => {
    return routes.some(route =>
        pathName === route || pathName.startsWith(`${route}/`)
    )
}

export const handle = async ({ event, resolve }) => {
	if (isAuthRoute(event.url.pathname, authRoutes)) {

        if (verify(event.cookies.get('rfh_tkn'))){
            return new Response('u got auth response');
        }

		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
};
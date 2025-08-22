import { verify } from '$lib/server/cookies';


const authRoutes = [
    '/profile123',
    '/community'
]

const isAuthRoute = (pathName, routes) => {
    return routes.some(route =>
        pathName === route || pathName.startsWith(`${route}/`)
    )
}

export const handle = async ({ event, resolve }) => {

    const acsTkn = verify(event.cookies.get('acs_tkn')) ?? null
    if (acsTkn) {
        event.locals.token = acsTkn;
    }

	if (isAuthRoute(event.url.pathname, authRoutes)) {

        if (acsTkn){
            return new Response('u got auth response');
        }

		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
};
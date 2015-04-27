'use strict';

/**
 *
 * @param {object} store - context of the store
 * @param {Route} route - route object to build middleware with
 *
 * @returns {GeneratorFunction}
 */
export default function routeMiddleware(store, route) {
	return function *routeMiddleware(next) {
		let result;

		if ((result = route.matches(window.location.href))) {
			store.currentPathParams = result.pathParams;
			store.currentQueryParams = result.queryParams;
			store.currentRoute = route;

			// Update the title of the page for the given route if
			// that option exists during setup.
			document.title = route.options.title || document.title;

			const handler = store.currentRoute.handler;

			console.log('debug starting handler: ', handler.name);

			yield *handler.call(store.getRouteContext(), next);

			console.log('debug done handler: ', handler.name);
		} else {
			yield *next;
		}
	};
}

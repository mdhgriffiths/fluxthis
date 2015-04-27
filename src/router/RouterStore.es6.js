'use strict';

const Immutable = require('immutable');
const invariant = require('invariant');

const ObjectOrientedStore = require('./../ObjectOrientedStore.es6.js');
const Route = require('./Route');
const Constants = require('./RouterConstants.es6');
const RouterActions = require('./RouterActions.es6');

const co = require('co');
const compose = require('koa-compose');

const DisplayName = 'FluxThisRouter';

module.exports = new ObjectOrientedStore({
	displayName: DisplayName,
	init() {
		/**
		 * Default path name when a route is not found or
		 * the hash is invalid.
		 * @type {string}
		 */
		this.defaultPath = '';

		/**
		 * current Route object that is set on each middleware execution
		 * that has a positive match
		 * @type {Route}
		 */
		this.currentRoute = null;

		/**
		 * All the routes the user has defined, not including `all` routes.
		 * These are mapped as route_name => Route for fast look ups.
		 *
		 * @type {{String: Route}}
		 */
		this.routes = {};

		/**
		 * Holds all the middleware functions that have been registered
		 * including route & all generators.
		 *
		 * @type {Array<GeneratorFunctions>}
		 */
		this.middleware = [];

		this.bindActions(
			Constants.ROUTER_USE_ACTION, this.addMiddleware,
			Constants.ROUTER_SETUP_ALL_ROUTE_ACTION, this.setupAllRoute,
			Constants.ROUTER_SETUP_ROUTE_ACTION, this.setupRoute,
			Constants.ROUTER_SET_REACT_ELEMENT, this.setReactElement,
			Constants.ROUTER_START, this.startRouter,
			Constants.ROUTE_CHANGE, this.changeRoute
		);

		window.onhashchange = this.changeRoute;
	},
	public: {
		/**
		 * Get the current react element that has been registered
		 * with the route.
		 *
		 * @returns {ReactElement}
		 */
		getReactElement() {
			return this.reactElement;
		},
		/**
		 * Get the props, if any, for the current react element.
		 * @returns {object}
		 */
		getReactElementProps() {
			return this.reactElementProps || {};
		},
		/**
		 * Get the path parameters for the current route based
		 * on the matched path that has current been matched.
		 *
		 * @returns {Immutable.Map}
		 */
		getPathParams() {
			return Immutable.fromJS(this.currentPathParams);
		},
		/**
		 * Get the query parameters for the current route based
		 * on the matched path that has current been matched.
		 *
		 * @returns {Immutable.Map}
		 */
		getQueryParams() {
			return Immutable.fromJS(this.currentQueryParams);
		},
		/**
		 * Get the current hash path.
		 *
		 * @returns {string}
		 */
		getPath() {
			return window.location.href.split('#')[1];
		}
	},
	private: {

		getContext() {
			return {
				getPath: this.getPath,
				getPathParams: this.getPathParams,
				getQueryParams: this.getQueryParams,
				setReactElement: RouterActions.setReactElement
			};
		},
		startRouter() {
			this.changeRoute();
		},
		setupAllRoute(payload) {
			let {path, handler} = payload;

			let route = new Route(path, handler, {all: true});

			this.middleware.push(routeMiddleware(this, route));
		},
		setupRoute(payload) {
			let {path, name, handler, options} = payload;

			// TODO: Add invariant on existing same name
			let route = new Route(path, handler, options);

			if (options.default) {
				this.defaultPath = name;
			}

			this.routes[name] = route;

			this.middleware.push(routeMiddleware(this, route));
		},
		setReactElement(payload) {
			const {reactElement, props} = payload;
			this.reactElement = reactElement;
			this.reactElementProps = props;
		},
		changeRoute() {
			if (!this.getPath()) {
				window.location.hash = this.routes[this.defaultPath].path;
				return;
			}

			let mw = [setupContext(this)].concat(this.middleware);

			var iterator = compose(mw)();

			(function iterate () {
				var iteration = iterator.next();
				if (!iteration.done) {
					iteration.value.then(function () {
						iterator.next();
					});
				}
			}())
		},
		checkIfHashIsMissingAndSetup() {
			if (!this.getPath()) {
				this.navigateToDefaultPath();
			}
		},
		navigateToDefaultPath() {
			const route = this.routes[this.defaultPath];
			window.location.hash = route.path;
		},
		/**
		 * Add a new middleware function with the allowed methods as a context
		 * to the list of middleware functions
		 *
		 * @param {Function}  generator function to be added.
		 */
		addMiddleware(func) {
			this.middleware.push(func.bind(this.getContext()));
		}
	}
});

function setupContext(context) {
	return function *setupContext(next) {
		context.checkIfHashIsMissingAndSetup();

		context.currentRoute = null;

		yield *next;

		// Todo figure out some check for 404s... maybe just follow koa.
	};
}
function routeMiddleware(store, route) {
	return function *routeMiddleware(next) {
		let result = {};

		if ((result = route.matches(window.location.href))) {
			store.currentPathParams = result.pathParams;
			store.currentQueryParams = result.queryParams;
			store.currentRoute = route;
			yield *store.currentRoute.handler.call(store.getContext(), next);
		} else {
			yield next;
		}
	};
}
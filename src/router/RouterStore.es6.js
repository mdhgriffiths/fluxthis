'use strict';

const Immutable = require('immutable');

const ObjectOrientedStore = require('./../ObjectOrientedStore.es6.js');
const Route = require('./Route');
const Constants = require('./RouterConstants.es6');
const RouterActions = require('./RouterActions.es6');
const routeMiddleware = require('./routeMiddleware.es6');

const iterateOverGenerator = require('../../lib/iterateOverGenerator.es6');

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
		/**
		 * Get the context that every middleware / route should have.
		 *
		 * This should be access to getter methods in the store and
		 * any actions that seem useful (like setting a react element)
		 *
		 * @return {object}
		 */
		getRouteContext() {
			// TODO: Don't create this guy here / investigate other places.
			return {
				getPath: this.getPath,
				getPathParams: this.getPathParams,
				getQueryParams: this.getQueryParams,
				setReactElement: RouterActions.setReactElement
			};
		},
		/**
		 * Starts the router. This should be called once
		 * all the middleware and routes have been defined.
		 */
		startRouter() {
			this.changeRoute();
		},
		/**
		 * This method should be called when the user is registering an
		 * `all` middleware route.
		 *
		 * @param {object} payload
		 * @param {string} payload.path
		 * @param {GeneratorFunction} payload.handler
		 */
		setupAllRoute(payload) {
			let {path, handler} = payload;

			let route = new Route(path, handler, {all: true});

			this.middleware.push(routeMiddleware(this, route));
		},
		/**
		 * This method should be called when the user is registering a new
		 * route.
		 *
		 * @param {object} payload
		 * @param {string} payload.path
		 * @param {string} payload.name
		 * @param {GeneratorFunction} payload.handler
		 * @param {object} [payload.options]
		 * @param {string} [payload.title] - title to set in the browser
		 * @param {boolean} [payload.default] - default path when 404
		 */
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
		/**
		 * This method should be called when the user has set a new
		 * react element based on a route change, so that any
		 * components listening for changes can be updated
		 * accordingly.
		 *
		 * @param {object} payload
		 * @param {ReactElement} payload.reactElement
		 * @param {object} [payload.props]
		 */
		setReactElement(payload) {
			const {reactElement, props={}} = payload;
			this.reactElement = reactElement;
			this.reactElementProps = props;
		},
		/**
		 * This method should be called when the user has changed the
		 * route via navigation or during initial setup of the application
		 * for page load.
		 */
		changeRoute() {
			if (!this.getPath()) {
				window.location.hash = this.routes[this.defaultPath].path;
				return;
			}

			let middleware = [setupRouterMiddleware(this), ...this.middleware];

			iterateOverGenerator(middleware);
		},
		/**
		 * This method should be used to check if the hash is missing
		 * (probably because the user navigated to the page w/o one)
		 * and adds the default path if it's not found.
		 */
		checkIfHashIsMissingAndSetup() {
			if (!this.getPath()) {
				const route = this.routes[this.defaultPath];
				window.location.hash = route.path;
			}
		},
		/**
		 * Add a new middleware function with the allowed methods as a context
		 * to the list of middleware functions
		 *
		 * @param {Function}  generator function to be added.
		 */
		addMiddleware(func) {
			this.middleware.push(function *middlewareDebugger(next) {
				console.log('debug calling: ', func.name);
				yield *func.call(this.getRouteContext(), next);
				console.log('debug done: ', func.name);
			}.bind(this));
		}
	}
});

function setupRouterMiddleware(context) {
	return function *setupRouterMiddleware(next) {
		context.checkIfHashIsMissingAndSetup();

		context.currentRoute = null;

		yield *next;

		// Todo figure out some check for 404s... maybe just follow koa.
	};
}

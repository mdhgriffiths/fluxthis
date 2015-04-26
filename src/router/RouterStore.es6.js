'use strict';


const ObjectOrientedStore = require('./../ObjectOrientedStore.es6.js');
const Route = require('./Route');

const React = require('react');
const Immutable = require('immutable');
const invariant = require('invariant');

const DisplayName = 'FluxThisRouter';

module.exports = new ObjectOrientedStore({
	displayName: DisplayName,
	init() {
		this.defaultPath = '';
		this.routeNotFoundPath = '';

		this.currentRoute = null;
		this.routes = {};

		this.bindActions(
			'SET_ROUTES', this.setupRoutes,
			'ROUTE_CHANGE', this.changeRoute
		);
	},
	public: {
		getReactElement() {
			return this.reactElement;
		},
		getReactElementProps() {
			return this.reactElementProps || {};
		},
		getPathParams() {
			return this.currentPathParams;
		},
		getQueryParams() {
			return this.currentQueryParams;
		},
		getPath() {
			return this.path;
		},
		getHashPath() {
			return this.currentHash;
		},
		/**
		 * TODO: Make sure this isn't exposed publicly except to the router
		 */
		setReactElement(reactElement, props={}) {
			this.setReactElement(reactElement, props);
		},
		setupRoutes(config) {
			//TODO: Add invariants
			this.defaultPath = config.defaultPath;
			this.routeNotFoundPath = config.routeNotFoundPath || this.defaultPath;

			this.currentRoute = null;
			this.routes = {};

			for (let key in config.routes) {
				this.routes[key] = new Route(
					config.routes[key].path,
					config.routes[key].handler
				);
			}

			this.setupRoute();

			const RouterHandler = require('./RouterComponent.es6.jsx');

			React.render(
				React.createElement(RouterHandler),
				document.getElementById(config.mountNodeID)
			);
		}
	},
	private: {
		setReactElement(reactElement, props={}) {
			this.reactElement = reactElement;
			this.reactElementProps = props;
		},
		changeRoute(path) {
			// TODO: Take args which should have new path. set hash. resetup route
			window.location.hash = `#${path}`;
			this.setupRoute();
		},
		checkIfHashIsMissingAndSetup() {
			if (!window.location.hash) {
				this.navigateToDefaultPath();
			}
		},
		navigateToDefaultPath() {
			const route = this.routes[this.defaultPath];
			window.location.hash = route.path;
		},
		setupRoute() {
			this.checkIfHashIsMissingAndSetup();

			this.currentRoute = null;

			for (let key in this.routes) {

				let route = this.routes[key];
				this.currentQueryParams = route.matches(window.location.href);

				if (this.currentQueryParams) {
					this.currentRoute = Object.freeze(route);
					break;
				}
			}

			if (!this.currentRoute) {
				return this.navigateToDefaultPath();
			}
		}
	}
});
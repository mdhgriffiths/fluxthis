'use strict';


const ObjectOrientedStore = require('./../ObjectOrientedStore.es6.js');
const Route = require('./Route');

const React = require('react');
const Immutable = require('immutable');
const invariant = require('invariant');

const DisplayName = 'FluxThisRouter';



export default class RouterStore extends ObjectOrientedStore {
	constructor(config) {
		const parentOptions = {
			displayName: DisplayName,
			init: getInitializeFunction(config),
			public: getPublicMethods(),
			private: privateMethods
		};

		super(parentOptions);
	}

	toString() {
		return `[${DisplayName}]`;
	}
}


function getInitializeFunction(config) {
	return function () {
		// TODO: Validation on params
		this.defaultMountNodeID = config.mountNodeID;
		this.defaultPath = config.defaultPath;
		this.routeNotFoundPath = config.routeNotFoundPath || this.defaultPath;

		this.currentRoute = null;
		this.routes = {};

		for (let key in config.routes) {
			// TODO: Add invariants
			this.routes[key] = new Route(
				config.routes[key].path,
				config.routes[key].handler
			);
		}

		this.setupRoute();

		this.bindActions(
			'ROUTE_CHANGE', this.changeRoute
		);
	};
}

function getPublicMethods() {
	return {
		getReactElement() {
			return this.reactElement;
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
		setReactElement(reactElement, props={}, optionalMountNodeID='') {
			invariant(
				ReactElement instanceof ReactElement,
				`${this} You must pass a valid ReactElement object to be ` +
				'mounted by the router.'
			);

			const mountNodeID = optionalMountNodeID || this.mountNodeID;

			React.render(
				React.createElement(reactElement, props),
				document.getElementById(mountNodeID)
			);
		}
	};
}

const privateMethods = {
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
			if (this.currentQueryParams = route.matches(window.location.href)) {
				this.currentRoute = Object.freeze(route);
				break;
			}
		}

		if (!this.currentRoute) {
			return this.navigateToDefaultPath();
		}
	}
};

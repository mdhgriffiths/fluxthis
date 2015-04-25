'use strict';

const ObjectOrientedStore = require('./../ObjectOrientedStore.es6.js');
const Route = require('./Route');

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
		// Set from config
		// TODO: Validation on params

		this.defaultMountNodeID = config.mountNodeID;
		this.defaultPath = config.defaultPath || '/';

		this.currentRoute = null;
		this.routes = {};

		for (let key in config.routes) {
			// TODO: Add invariants

			this.routes[key] = new Route(
				config.routes[key].path,
				config.routes[key].handler,
				config.routes[key].reactElement,
				config.routes[key].mountNodeID || this.defaultMountNodeID
			);
		}

		if (!window.location.hash) {
			window.location.hash = this.defaultPath;
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
		}
	};
}

const privateMethods = {
	changeRoute(path) {
		// TODO: Take args which should have new path. set hash. resetup route
		window.location.hash = `#${path}`;
		this.setupRoute();
	},
	setupRoute() {
		this.currentRoute = null;
		debugger;
		for (let key in this.routes) {
			let route = this.routes[key];
			if (this.currentQueryParams = route.matches(window.location.href)) {
				this.currentRoute = Object.freeze(route);
				break;
			}
		}

		if (!this.currentRoute) {
			// Go to default route 404.. TODO: Set this up
			return;
		}
	},
	setReactClass() {
		invariant(
			ReactElement instanceof ReactElement,
			`${this} You must pass a valid ReactElement object to be ` +
			'mounted by the router.'
		)
	}
};

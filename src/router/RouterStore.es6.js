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

		this.routes = {};

		for (let key in config.routes) {
			// TODO: Add invariants

			routes[key] = new Route(
				config.path,
				config.handler,
				config.reactElement,
				config.mountNodeID || this.defaultMountNodeID
			);
		}

		this.reactElement = ''; // react element

		this.bindActions();
	};
}

function getPublicMethods() {
	return {
		getReactElement() {
			return this.reactElement;
		},
		getPathParams() {
			return this.pathParams;
		},
		getQueryParams() {
			return this.queryParams;
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
	setReactClass() {
		invariant(
			ReactElement instanceof ReactElement,
			`${this} You must pass a valid ReactElement object to be ` +
			'mounted by the router.'
		)
	}
};

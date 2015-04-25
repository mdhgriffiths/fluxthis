'use strict';

const ObjectOrientedStore = require('./../ObjectOrientedStore.es6.js');

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
		this.routes = Immutable.Map(config.routes);

		this.path = window.location;
		this.currentHash = window.location.hash.substr(1);

		//this.routes.forEach((callback, route) => {
		//	debugger;
		//	if (route === '*' || new RegExp(route).test(this.currentHash)) {
		//		const generator = callback();
		//	}
		//});

		// TODO: Parse any query & path params
		this.queryParams = Immutable.Map();
		this.pathParams = Immutable.Map();

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
	setReactClass(reactElement, mountNode) {
		invariant(
			ReactElement instanceof ReactElement,
			`${this} You must pass a valid ReactElement object to be ` +
			'mounted by the router.'
		)
	}
};

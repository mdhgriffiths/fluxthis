'use strict';

require('babel/polyfill');

const RouterStore = require('./router/RouterStore.es6');
const RouterActions = require('./router/RouterActions.es6');
const invariant = require('invariant');

const REGISTERED = Symbol('registered');

class Router {
	register(callback) {
		invariant(
			typeof callback === 'function',
			'You must register a callback function that takes a router ' +
			'object in order to register new routes.'
		);

		const self = this;
		callback({
			use(...args) {
				self[REGISTERED] = true;
				RouterActions.use(...args);
				return this;
			},
			all(...args) {
				self[REGISTERED] = true;
				RouterActions.all(...args);
				return this;
			},
			route(...args) {
				self[REGISTERED] = true;
				RouterActions.route(...args);
				return this;
			}
		});

		return this;
	}

	start() {
		invariant(
			this[REGISTERED] === true,
			'You must register some routes before you can start your router.'
		);

		RouterActions.start();
	}

}

module.exports = new Router();
module.exports.mixin = {
	redirect: RouterActions.rewrite,
	navigate: Router.navigate,
	getPath: RouterStore.getPath,
	getPathParams: RouterStore.getPathParams,
	getQueryParams: RouterStore.getQueryParams
};


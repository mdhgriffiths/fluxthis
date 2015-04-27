'use strict';

require('babel/polyfill');

const RouterStore = require('./router/RouterStore.es6');
const RouterActions = require('./router/RouterActions.es6');


const Router = {
	mixin: {
		getPath: RouterStore.getPath,
		getHashPath: RouterStore.getHashPath,
		getPathParams: RouterStore.getPathParams,
		getQueryParams: RouterStore.getQueryParams
	},
	RouterStore,
	use: RouterActions.use,
	all: RouterActions.all,
	route: RouterActions.route,
};

Router
	.use(function *check(next) {
		// do some checks
		console.log('start');
		yield *next;
		console.log('done');
	})
	.use(function *foo(next) {
		// do stuff
		yield *next;
		// do more stuff
	})
	// .all('*', function *handler(next) {
	// 	yield next;
	// })
	.route('/', 'default', function *handler(next) {
		//this.setReactElement();
		yield *next;
	}, {default: true})
	// .route('/foo/:bar', 'setupFoobar', function *handler(next) {
	// 	const pathParams = this.getPathParams();
	// 	this.setReactElement();

	// 	yield next;
	// })
	// .route('/users', 'userList', function *handler(next) {
	// 	this.navigateTo('setupFoobar', {bar: 'foo'});
	// 	yield next;
	// })
	.use(function *foo(next) {
		console.log('middle 1');
		yield new Promise(resolve => {
			setTimeout(() => {
				console.log('middle 1.5');
				resolve();
			}, 1000);
		})
		yield *next;
		console.log('middle 2');
	})
	.start();

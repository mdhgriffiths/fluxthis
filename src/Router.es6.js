'use strict';

require('babel/polyfill');

var x = {
	Router: require('./router/RouterStore.es6'),
	Handler: require('./router/RouterComponent.es6.jsx')
};

new x.Router({
	routes: {
		'*': 'first'
	},
	handlers: {
		first: function *() {
			debugger;
			console.log('1');
			yield *this.second();
			console.log('2');
		},
		second: function *(next) {
			debugger;
			console.log('foo');
		}
	}
});

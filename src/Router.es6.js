'use strict';

require('babel/polyfill');

var x = {
	Router: require('./router/RouterStore.es6'),
	Handler: require('./router/RouterComponent.es6.jsx')
};

debugger;
new x.Router({

	mountNodeID: 'test',
	routes: {
		first: {
			path: '/',
			handler: function () {
				debugger;
			}
		}
	}
});
debugger;

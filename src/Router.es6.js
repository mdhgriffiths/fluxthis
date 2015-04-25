'use strict';

require('babel/polyfill');

var x = {
	Router: require('./router/RouterStore.es6'),
	Handler: require('./router/RouterComponent.es6.jsx')
};

const Foobar = {};
const defaultProps = {};

debugger;
new Router({
	mountNodeID: 'test',
	defaultPath: 'user_list',
	routes: {
		setup_foobar: {
			path: '/foo/:bar',
			handler(bar) {
				// Set default props
				this.setReactElement(Foobar, {bar}, 'optionalMountNode');
			}
		},
		user_list: {
			path: '/users',
			handler() {
				this.navigateTo('setup_foobar', {bar: 'bar'});
			}
		}
	}
});
debugger;

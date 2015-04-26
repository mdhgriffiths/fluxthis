'use strict';

require('babel/polyfill');

const React = require('react');

var x = {
	Router: require('./router/RouterStore.es6'),
	Handler: require('./router/RouterComponent.es6.jsx')
};

const Foobar = {};
const defaultProps = {};

x.Router.setupRoutes({
	mountNodeID: 'body',
	defaultPath: 'user_list',
	routes: {
		default: {
			path: '/',
			handler() {
			}
		},
		setupFoobar: {
			path: '/foo/:bar',
			handler(bar) {
				// Set default props
				//this.setReactElement(Foobar, {bar}, 'optionalMountNode');
			}
		},
		userList: {
			path: '/users',
			handler() {
				//this.navigateTo('setup_foobar', {bar: 'bar'});
			}
		}
	}
});

x.Router.setReactElement(
	React.createClass({
		render() {
			return (<div>sup</div>);
		}
	})
);

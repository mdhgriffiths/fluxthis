'use strict';

require('babel/polyfill');

const RouterStore = require('./router/RouterStore.es6');
const RouterActions = require('./router/RouterActions.es6');


const Router = {
	mixin: {
		getPath: RouterStore.getPath,
		getPathParams: RouterStore.getPathParams,
		getQueryParams: RouterStore.getQueryParams
	},
	RouterStore,
	use: RouterActions.use,
	all: RouterActions.all,
	route: RouterActions.route
};

window.Router = Router;

React.render(React.createElement(React.createClass({
	displayName: 'MainComponent',
	mixins: [Router.RouterStore.mixin],
	getStateFromStores() {
		return {
			reactElement: RouterStore.getReactElement(),
			reactElementProps: RouterStore.getReactElementProps()
			// you can also use any other getters from the store
			// like getPath, getQueryParams, getPathParams
		};
	},
	render() {
		const {reactElement: ReactComponent, reactElementProps: props} = this.state;

		if (!ReactComponent) {
			return null;
		}

		return (
			<ReactComponent {...props} />
		);
	}
})), document.body);

const el = React.createClass({
	render() {
		return (<div>sup</div>);
	}
});

const el2 = React.createClass({
	render() {
		return (<div>{this.props.propValue}</div>);
	}
});

Router
	.use(function *check(next) {
		// do some checks
		yield *next;
	})
	.use(function *foo(next) {
		yield *next;
	})
	.all('*', function *handler(next) {
		yield *next;
	})
	.route('/', 'default', function *handler(next) {
		this.setReactElement(el);
		yield *next;
	}, {
		default: true
	})
	.route('/foo/:bar', 'setupFoobar', function *handler(next) {
		const pathParams = this.getPathParams();
		this.setReactElement(el2, {propValue: pathParams.get('bar')});
		yield *next;
	})
	.use(function *done(next) {
		yield *next;
	})
	.start();

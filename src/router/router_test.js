'use strict';

const Router = require('../Router.es6');
const RouterStore = require('./RouterStore.es6');

window.Router = Router;

React.render(React.createElement(React.createClass({
	displayName: 'MainComponent',
	mixins: [RouterStore.mixin],
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

function test(router) {

	router.all('*', function *handler(next) {
		yield *next;
	});

	router.route('/', 'default', function *handler(next) {
		debugger;
		this.setReactElement(el);
		yield *next;
	}, {
		default: true
	});

}

function foo(router) {
	router.route('/foo/:bar?', 'setupFoobar', function *handler(next) {
		debugger;
		const pathParams = this.getPathParams();
		this.setReactElement(el2, {propValue: pathParams.get('bar')});
		yield *next;
	});
}

function startMiddleware(router) {
	router.use(function *check(next) {
		// do some checks
		yield *next;
	});

	router.use(function *foo(next) {
		yield *next;
	});
}

function endMiddleware(router) {
	router.use(function *done(next) {
		yield *next;
	});
}

debugger;
Router
	.register(startMiddleware)
	.register(foo)
	.register(test)
	.register(endMiddleware)
	.start();

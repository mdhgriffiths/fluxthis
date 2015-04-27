'use strict';

const ImmutablePureRenderMixin = require('react-immutable-render-mixin');

const RouterStore = require('./RouterStore.es6');

export default React.createClass({
	displayName: 'FluxThisRouterHandler',
	mixins: [RouterStore.mixin, ImmutablePureRenderMixin],
	getStateFromStores() {
		return {
			reactElement: RouterStore.getReactElement(),
			reactElementProps: RouterStore.getReactElementProps(),
			queryParams: RouterStore.getQueryParams(),
			pathParams: RouterStore.getPathParams(),
			path: RouterStore.getPath(),
			hashPath: RouterStore.getHashPath(),
		};
	},
	render() {
		const ReactComponent = this.state.reactElement;

		if (!ReactComponent) {
			return null;
		}
		const RouterState = Object.assign({
				RouterState: {
					queryParams: this.state.queryParams,
					pathParams: this.state.pathParams,
					path: this.state.path,
					hashPath: this.state.hashPath
				}
			}, this.state.reactElementProps);

		return (
			<ReactComponent {...RouterState} />
		);
	}
});
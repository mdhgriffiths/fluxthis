'use strict';

const React = require('react');
const ImmutablePureRenderMixin = require('react-immutable-render-mixin');

const RouterStore = require('./RouterStore.es6');

export default React.createClass({
	displayName: 'FluxThisRouterHandler',
	mixins: [RouterStore.mixin, ImmutablePureRenderMixin],
	getStateFromStores() {
		return {
			ReactElement: RouterStore.getReactElement(),
			queryParams: RouterStore.getQueryParams(),
			pathParams: RouterStore.getPathParams(),
			path: RouterStore.getPath(),
			hashPath: RouterStore.getHashPath()
		};
	},
	render() {
		const ReactComponent = this.state.ReactElement;
		const RouterState = {RouterState: this.state};

		return (
			<ReactComponent {...RouterState} />
		);
	}
});
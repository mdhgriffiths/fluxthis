'use strict';

const ActionCreator = require('../ActionCreator.es6');
const Constants = require('./RouterConstants.es6');

export default new ActionCreator({
	displayName: 'ROUTER',
	actionSource: 'ROUTER',

	use: {
		actionType: Constants.ROUTER_USE_ACTION,
		payloadType: ActionCreator.PayloadTypes.func.isRequired
	},

	all: {
		actionType: Constants.ROUTER_SETUP_ALL_ROUTE_ACTION,
		payloadType: ActionCreator.PayloadTypes.shape({
			path: ActionCreator.PayloadTypes.string.isRequired,
			handler: ActionCreator.PayloadTypes.func.isRequired
		}),
		createPayload(path, handler) {
			return {
				path,
				handler
			};
		}
	},

	route: {
		actionType: Constants.ROUTER_SETUP_ROUTE_ACTION,
		payloadType: ActionCreator.PayloadTypes.shape({
			path: ActionCreator.PayloadTypes.string.isRequired,
			name: ActionCreator.PayloadTypes.string.isRequired,
			handler: ActionCreator.PayloadTypes.func.isRequired,
			options: ActionCreator.PayloadTypes.shape({
				default: ActionCreator.PayloadTypes.bool,
				title: ActionCreator.PayloadTypes.string
			})
		}),
		createPayload(path, name, handler, options={}) {
			return {
				path,
				name,
				handler,
				options
			};
		}
	},

	setReactElement: {
		actionType: Constants.ROUTER_SET_REACT_ELEMENT,
		payloadType: ActionCreator.PayloadTypes.shape({
			reactElement: ActionCreator.PayloadTypes.func.isRequired,
			props: ActionCreator.PayloadTypes.object
		}),
		createPayload(reactElement, props={}) {
			return {
				reactElement,
				props
			};
		}
	},

	start: {
		actionType: Constants.ROUTER_START
	}
});
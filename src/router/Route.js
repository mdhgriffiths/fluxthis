'use strict';

const pathToRegExp = require('path-to-regexp');
const reverend = require('reverend');

const URL = Symbol();
const HANDLER = Symbol();

export default class Route {
	constructor(path, handler, reactElement, mountNodeID) {
		this.path = path;
		this.handler = handler;
		this.reactElement = reactElement;
		this.mountNodeID = mountNodeID;

		this.keys = [];
		this.regex = pathToRegExp(path, this.keys);
	}

	/**
	 * Checks to see if the current URL matches the path of the current
	 * route. If so, then it returns an object of mapped param keys
	 * to values.
	 *
	 * This method does not yet take into account query parameters.
	 *
	 * @param url
	 * @returns {Object|null}
	 */
	matches(url) {

		if (!url) {
			return null;
		}

		const hashPosition = url.indexOf('#');

		// Strip out anything before the # including the #.
		if (hashPosition >= 0) {
			url = url.substring(hashPosition + 1);
		}
		// Get & strip query params
		const queryPosition = url.indexOf('?');

		// Strip out query string.
		if (queryPosition >= 0) {
			url = url.substring(0, queryPosition);
		}

		const urlMatchesRoute = this.regex.exec(url);

		if (!urlMatchesRoute) {
			return null;
		}

		const routeParams = {};

		this.keys.forEach((value, index) => {
			routeParams[value.name] = urlMatchesRoute[index + 1];
		});

		return routeParams;
	}

	/**
	 * Construct a path for the given parameters.
	 *
	 * @param params
	 * @returns {String|null}
	 */
	makePath(params) {
		try {
			return reverend(this.path, params);
		} catch (e) {
			return null;
		}
	}
}
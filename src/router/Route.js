'use strict';

const pathToRegExp = require('path-to-regexp');
const reverend = require('reverend');
const qsParse = require('qs/lib/parse');

const URL = Symbol();
const HANDLER = Symbol();

export default class Route {
	constructor(path, handler, options) {
		this.path = path;
		this.handler = handler;
		this.options = options;

		this.keys = [];

		if (options.all) {
			this.regex = new RegExp(path.replace(/\*/g, '.*?'));
		} else {
			this.regex = pathToRegExp(path, this.keys);
		}
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
		let hash = '';

		// Strip out anything before the # including the #.
		if (hashPosition >= 0) {
			hash = url.substring(hashPosition + 1);
		}
		// Get & strip query params
		const queryPosition = url.indexOf('?');
		let queryString = '';

		// Strip out query string.
		if (queryPosition >= 0) {
			queryString = url.substring(queryPosition + 1, hashPosition);
		}

		const urlMatchesRoute = this.regex.exec(hash);

		if (!urlMatchesRoute) {
			return null;
		}

		const result = {
			routeParams: {},
			queryParams: {}
		};

		if (this.options.all) {
			return result;
		}

		result.queryParams = qsParse(queryString);

		this.keys.forEach((value, index) => {
			result.routeParams[value.name] = urlMatchesRoute[index + 1];
		});

		return result;
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
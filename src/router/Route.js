'use strict';

const pathToRegExp = require('path-to-regexp');
const reverend = require('reverend');
const qsParse = require('qs/lib/parse');

const URL = Symbol();
const HANDLER = Symbol();

export default class Route {
	/**
	 *
	 * @param {string} path - path defined by the user
	 * @param {GeneratorFunction} handler
	 * @param {object} [options]
	 * @param {boolean} [options.all]
	 */
	constructor(path, handler, options) {
		this.path = path;
		this.handler = handler;
		this.options = options;

		this.keys = [];

		// If the option is an `all` option, then we regex differently
		if (options.all) {
			this.regex = new RegExp(path.replace(/\*/g, '.*?'));
		}
		// Else we want to make sure the path has valid path parameters
		else {
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

		const hashString = getHashString(url);
		const queryString = getQueryString(url);

		const urlMatchesRoute = this.regex.exec(hashString);

		if (!urlMatchesRoute) {
			return null;
		}

		const result = {
			routeParams: {},
			queryParams: {}
		};

		// If this is an `all` route, then we don't match anything.
		if (this.options.all) {
			return result;
		}

		// Get the query string params, if applicable. default = {}
		result.queryParams = qsParse(queryString);

		// Build up all the route params from the path-to-regexp output
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


function getHashString(url) {
	const hashPosition = url.indexOf('#');

	// Strip out anything before the # including the #.
	if (hashPosition >= 0) {
		return url.substring(hashPosition + 1);
	}

	return '';
}

function getQueryString(url) {
	// Get the query param position and strip it from the url for parsing.
	const queryPosition = url.indexOf('?');
	let hashPosition = url.indexOf('#');

	// Strip out query string.
	if (queryPosition >= 0) {
		if (hashPosition === -1) {
			hashPosition = url.length;
		}

		return url.substring(queryPosition + 1, hashPosition);
	}

	return '';
}
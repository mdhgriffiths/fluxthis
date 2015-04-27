'use strict';

const compose = require('koa-compose');

/**
 *
 * @param Array<GeneratorFunction> middleware
 */
export default function iterateOverGenerator(middleware) {

	let iterator = compose(middleware)();

	function iterate(value) {
		let iteration;

		if (value) {
			iteration = value.next();
		} else {
			iteration = iterator.next();
		}

		if (!iteration.done) {
			if ('then' in iteration.value) {
				iteration.value.then(function iterateGenerator() {
					iterator.next();
				});
			} else {
				iterate(iteration.value);
			}
		}
	}

	setTimeout(iterate);
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

require('babel/polyfill');

export default {
	ConstantCollection: require('./ConstantCollection.es6'),
	ImmutableStore: require('./ImmutableStore.es6'),
	ObjectOrientedStore: require('./ObjectOrientedStore.es6'),
	ActionCreator: require('./ActionCreator.es6'),
	APIActionCreator: require('./APIActionCreator.es6'),
	dispatcher: require('./dispatcherInstance.es6')
};

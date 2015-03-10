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

var webpack = require('webpack');
var filename = 'FluxThis' +
    (process.env.NODE_ENV ==='production' ? '.min' : '') +
    '.js';

module.exports = {
    cache: true,
    entry: {
        FluxThis: './src/FluxThis'
    },
    output: {
        path: __dirname + '/build',
        filename: filename,
        library: 'FluxThis',
        libraryTarget: 'umd'
    },
    devtool: 'sourcemap',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        })
    ],
    resolve: {
        root: __dirname,
        extensions: ['', '.webpack.js', '.web.js', '.js', '.es6.js'],
        modulesDirectories: ['web_modules', 'node_modules']
    },
    module: {
        loaders: [{
             test: /\.es6\.js$/, exclude: /node_modules/, loader: '6to5-loader'
        }]
    }
};

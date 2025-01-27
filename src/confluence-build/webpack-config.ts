/**
 * Copyright <update-me> <update-me>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Configuration } from 'webpack';

import { Output } from '../common';

interface WebpackConfigProps {
    mode: 'production' | 'development';
    output: Output;
}

const webpackConfig = ({ mode, output }: WebpackConfigProps): Configuration => {
    return {
        mode,
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.css'],
            fallback: {}
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        target: 'web',
        output: {
            filename: 'index.js',
            path: output.site.home,
            publicPath: '/'
        }
    };
};

export { webpackConfig };

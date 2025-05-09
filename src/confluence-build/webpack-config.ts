/**
 * Copyright 2025 Hasnae Rehioui
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
import path from 'path';

import { listFiles } from '@labset/fs-directory';
// eslint-disable-next-line import/default
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';

import { Output, prepareSiteProperties } from '../common';

interface WebpackConfigProps {
    mode: 'production' | 'development';
    isDev: boolean;
    output: Output;
    assets: string | undefined;
}

const isWDIO = process.env.NODE_ENV === 'webdriverio';

const webpackConfig = ({
    mode,
    isDev,
    output,
    assets
}: WebpackConfigProps): Configuration => {
    const indexFiles = listFiles(output.templates.home, {
        fileFilter: (entry) => entry.name === 'index.html',
        directoryFilter: () => true
    });

    const htmlPlugins = indexFiles.map((template) => {
        const filename = template.replace(`${output.templates.home}/`, '');
        return new HtmlWebpackPlugin({
            template,
            filename
        });
    });

    const definePlugin = new DefinePlugin({
        __SITE_PROPERTIES__: JSON.stringify(prepareSiteProperties()),
        process: { env: { CI: false } }
    });

    const copyPlugin = assets
        ? new CopyWebpackPlugin({
              patterns: [
                  {
                      from: path.join(process.cwd(), assets),
                      to: path.join(output.site.home, 'assets')
                  }
              ]
          })
        : undefined;

    const plugins = copyPlugin
        ? [definePlugin, ...htmlPlugins, copyPlugin]
        : [definePlugin, ...htmlPlugins];

    const staticSiteSources = path.join(__dirname, '..', 'static-site');
    let siteEntry = isDev
        ? path.join(staticSiteSources, 'index.tsx')
        : path.join(staticSiteSources, 'index.js');

    if (isWDIO) {
        siteEntry = path.join(staticSiteSources, 'index.js');
    }

    return {
        mode,
        entry: {
            site: siteEntry
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.css'],
            fallback: {
                buffer: false
            }
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
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource'
                }
            ]
        },
        target: 'web',
        output: {
            filename: 'index.js',
            path: output.site.home,
            publicPath: '/'
        },
        plugins
    };
};

export { webpackConfig };

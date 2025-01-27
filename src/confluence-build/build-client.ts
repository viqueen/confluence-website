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
import { webpack } from 'webpack';
import { default as Server } from 'webpack-dev-server';

import { Output } from '../common';

import { Build } from './types';
import { webpackConfig } from './webpack-config';

class BuildClient implements Build {
    async prod(output: Output): Promise<void> {
        const config = webpackConfig({
            mode: 'production',
            output
        });
        const compiler = webpack(config);
        compiler.run((error, stats) => {
            if (error) {
                console.error(error.stack || error);
                return;
            }
            if (stats) {
                console.info(
                    stats.toString({
                        errorDetails: true,
                        chunks: false, // Makes the build much quieter
                        colors: true // Shows colors in the console
                    })
                );
            }
        });
    }

    async dev(output: Output, port: number): Promise<void> {
        const config = webpackConfig({
            mode: 'development',
            output
        });
        const compiler = webpack(config);
        const devServer = {
            static: { directory: output.site.home },
            client: { progress: true },
            compress: true,
            port
        };
        const server = new Server(devServer, compiler);
        const runServer = async () => {
            console.info('Starting server...');
            await server.start();
        };
        await runServer();
    }
}

export { BuildClient };

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
import { ChildProcess, exec } from 'child_process';
import path from 'path';

import type { Options, Capabilities } from '@wdio/types';
import axios from 'axios';

let testServerProcess: ChildProcess;

// noinspection JSUnusedGlobalSymbols
export const config: Options.Testrunner &
    Capabilities.WithRequestedTestrunnerCapabilities = {
    runner: 'local',
    tsConfigPath: './test/tsconfig.json',

    specs: ['./test/specs/**/*.ts'],
    exclude: [],
    maxInstances: 10,

    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless', '--disable-gpu', '--disable-dev-shm-usage']
            }
        }
    ],

    logLevel: 'debug',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [
        [
            'visual',
            {
                screenshotPath: path.join(process.cwd(), 'artifacts')
            }
        ]
    ],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    onPrepare: async function (_config, _capabilities) {
        console.info('** onPrepare **');
        testServerProcess = exec(
            'node dist/cli/index.js build-space public --dest local --dev',
            (error, stdout, _stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.info(`stdout: ${stdout}`);
            }
        );
        await waitForServer('http://localhost:3000');
    },
    onComplete: function (_exitCode, _config, _capabilities, _results) {
        return testServerProcess.kill();
    }
};

async function waitForServer(url: string, timeout = 30000, interval = 1000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        try {
            await axios.get(url);
            console.info('Webpack Dev Server is up!');
            return;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }
    throw new Error('Timed out waiting for server');
}

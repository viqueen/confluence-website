#!/usr/bin/env node

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
import { Command } from 'commander';

import { prepareEnvironment, prepareOutput } from '../common';

import {
    commandBuildSpace,
    commandExtractSpace,
    commandInitEnv,
    commandInitSite
} from './commands';

const program = new Command();

const withOptions = (cmd: string, description: string) => {
    return program
        .command(cmd)
        .description(description)
        .option('--dest <dest>', 'with output destination', 'output');
};

// configure environment variables
withOptions('init-env', 'Configure environment variables').action(async () => {
    await commandInitEnv();
});

// configure site properties
withOptions('init-site', 'Configure site properties').action(async () => {
    await commandInitSite();
});

// extract content from a space
withOptions(`extract-site <spaceKey>`, 'Extract content from a space').action(
    async (spaceKey: string, options: { dest: string }) => {
        const environment = prepareEnvironment();
        const output = prepareOutput({ destination: options.dest });
        await commandExtractSpace(environment, output, spaceKey);
    }
);

// build site resources
withOptions(`build-site`, 'Build site resources')
    .option('--assets <value>', 'with assets')
    .option('--dev', 'build for development', false)
    .option('--port <port>', 'development server port', '3000')
    .action(
        async (options: {
            dest: string;
            dev: boolean;
            assets: string | undefined;
            port: string;
        }) => {
            const output = prepareOutput({
                destination: options.dest
            });
            await commandBuildSpace(
                output,
                options.dev,
                parseInt(options.port),
                options.assets
            );
        }
    );

// eslint-disable-next-line @typescript-eslint/no-require-imports
program.version(require('../../package.json').version);
program.parse(process.argv);

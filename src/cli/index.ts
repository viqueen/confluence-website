#!/usr/bin/env node

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
import { Command } from 'commander';

import { initEnvCommand } from './init-env-command';

const program = new Command();

const withOptions = (cmd: string, description: string) => {
    return program
        .command(cmd)
        .description(description)
        .option('--dest <dest>', 'with output destination', 'output');
};

// configure environment variables
withOptions('init-env', 'Configure environment variables').action(async () => {
    await initEnvCommand();
});

// configure site properties
withOptions('init-site', 'Configure site properties').action(() => {
    console.log('Configuring site properties');
});

// extract content from a space
withOptions(`extract-space <spaceKet>`, 'Extract content from a space').action(
    async (spaceKey: string, options: { dest: string }) => {
        console.log(
            'Extracting content from space',
            spaceKey,
            'to',
            options.dest
        );
    }
);

// build site resources
withOptions(`build-space <spaceKey>`, 'Build site resources').action(
    async (spaceKey: string, options: { dest: string }) => {
        console.log(
            'Building site resources for',
            spaceKey,
            'to',
            options.dest
        );
    }
);

// eslint-disable-next-line @typescript-eslint/no-require-imports
program.version(require('../../package.json').version);
program.parse(process.argv);

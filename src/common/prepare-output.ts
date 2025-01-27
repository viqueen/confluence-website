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
import fs from 'fs';
import path from 'path';

interface Output {
    site: {
        home: string;
        page: string;
        blogpost: string;
        folder: string;
    };
    templates: {
        home: string;
        page: string;
        blogpost: string;
        folder: string;
    };
}

interface PrepareOutputProps {
    spaceKey: string;
    destination: string;
}

const makeOutputDirectories = (data: object) => {
    for (const dir of Object.values(data)) {
        if (typeof dir === 'string') {
            fs.mkdirSync(dir, { recursive: true });
        } else {
            makeOutputDirectories(dir);
        }
    }
};

const prepareOutput = (props: PrepareOutputProps): Output => {
    const { spaceKey, destination } = props;
    const siteOutput = path.resolve(destination, 'site', spaceKey);
    const templatesOutput = path.resolve(destination, 'templates', spaceKey);
    const output = {
        site: {
            home: siteOutput,
            page: path.resolve(siteOutput, 'pages'),
            blogpost: path.resolve(siteOutput, 'blogs'),
            folder: path.resolve(siteOutput, 'folders')
        },
        templates: {
            home: templatesOutput,
            page: path.resolve(templatesOutput, 'pages'),
            blogpost: path.resolve(templatesOutput, 'blogs'),
            folder: path.resolve(templatesOutput, 'folders')
        }
    };
    makeOutputDirectories(output);
    return output;
};

export { prepareOutput };
export type { Output };

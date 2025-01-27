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
import { Output } from '../common';
import { Api, Content } from '../confluence-api';

import { Extract } from './types';

class ExtractClient implements Extract {
    constructor(private readonly api: Api) {}

    async extractSpace(spaceKey: string, output: Output): Promise<void> {
        console.info(`🪐 extract space: ${spaceKey}`);
        const space = await this.api.getSpace(spaceKey);
        const homepage = space.homepage;
        if (!homepage) {
            throw Error('❌ homepage not found');
        }
        const publicFolder = await this.api.searchSpacePublicFolder(spaceKey);
        if (!publicFolder.results[0].content) {
            throw Error('❌ public folder not found');
        }

        // extract homepage
        await this.extractContent(homepage, output);
    }

    private async extractContent(
        content: Content,
        _output: Output
    ): Promise<void> {
        console.info(`📄 extract content: ${content.title}`);
    }
}

export { ExtractClient };

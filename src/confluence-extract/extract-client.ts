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
import { Environment, Output } from '../common';
import { Api, Content } from '../confluence-api';

import { saveContentData, saveContentTemplate } from './save-content';
import { Extract } from './types';

class ExtractClient implements Extract {
    constructor(private readonly api: Api) {}

    async extractSpace(
        environment: Environment,
        output: Output,
        spaceKey: string
    ): Promise<void> {
        console.info(`🪐 extract space: ${spaceKey}`);
        const space = await this.api.getSpace(spaceKey);
        const homepage = space.homepage;
        if (!homepage) {
            throw Error('❌ homepage not found');
        }
        const response = await this.api.searchSpacePublicFolder(spaceKey);
        const publicFolder = response.results[0]?.content;
        if (!publicFolder) {
            throw Error('❌ public folder not found');
        }

        // extract homepage
        await this.extractContentItem(environment, output, homepage, true);
    }

    private async extractContentItem(
        environment: Environment,
        output: Output,
        contentItem: Content,
        asHomepage: boolean
    ): Promise<void> {
        const response = await this.api.searchContent(contentItem.id);
        const content = response.results[0]?.content;
        if (!content) {
            throw Error('❌ content not found');
        }
        await saveContentData(environment, output, content, asHomepage);
        await saveContentTemplate(environment, output, content, asHomepage);
    }
}

export { ExtractClient };

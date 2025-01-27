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

import { traverse } from '@atlaskit/adf-utils/traverse';
import { ADFEntity } from '@atlaskit/adf-utils/types';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { Environment, Output } from '../common';
import { Api, Content } from '../confluence-api';

import { saveContentData, saveContentTemplate } from './save-content';
import { ContentData, Extract } from './types';

class ExtractClient implements Extract {
    private readonly emojiClient: AxiosInstance;
    constructor(private readonly api: Api) {
        this.emojiClient = axios.create({
            baseURL:
                'https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net'
        });
    }

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
        // extract public folder
        await this.extractPageHierarchies(
            environment,
            output,
            publicFolder.children?.page.results ?? []
        );
    }

    private async extractPageHierarchies(
        environment: Environment,
        output: Output,
        pages: Content[]
    ): Promise<void> {
        for (const page of pages) {
            const parent = await this.extractContentItem(
                environment,
                output,
                page,
                false
            );
            const childPages = parent.children?.page?.results ?? [];
            await this.extractPageHierarchies(environment, output, childPages);
        }
    }

    private async extractContentItem(
        environment: Environment,
        output: Output,
        contentItem: Content,
        asHomepage: boolean
    ): Promise<Content> {
        console.info(
            `📄 extract content: ${contentItem.id} - ${contentItem.title}`
        );
        const response = await this.api.searchContent(contentItem.id);
        const content = response.results[0]?.content;
        if (!content) {
            throw Error('❌ content not found');
        }
        await saveContentTemplate(environment, output, content, asHomepage);
        const contentData = await saveContentData(
            environment,
            output,
            content,
            asHomepage
        );
        await this.extractEmojis(output, contentData);
        return content;
    }

    private async extractEmojis(
        output: Output,
        contentData: ContentData
    ): Promise<void> {
        const UUID_REGEX =
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

        traverse(contentData.body, {
            emoji: ({ attrs }: ADFEntity) => {
                if (!attrs || !attrs.id) return;
                if (UUID_REGEX.exec(attrs.id)) return;
                const targetFile = path.resolve(
                    output.site.assets.emojis,
                    `${attrs.id}.png`
                );
                if (fs.existsSync(targetFile)) return;

                const targetUrl = attrs.id.startsWith('atlassian')
                    ? `/atlassian/${attrs.id.split('-')[1]}_64.png`
                    : `/standard/caa27a19-fc09-4452-b2b4-a301552fd69c/64x64/${attrs.id}.png`;

                this.emojiClient
                    .get(targetUrl, { responseType: 'stream' })
                    .then((response) => ({ stream: response.data }))
                    .then(({ stream }) => {
                        const file = fs.createWriteStream(targetFile);
                        return stream.pipe(file);
                    });
            }
        });
    }
}

export { ExtractClient };

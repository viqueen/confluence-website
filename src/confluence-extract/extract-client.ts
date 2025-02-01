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
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { filter, traverse } from '@atlaskit/adf-utils/traverse';
import { ADFEntity } from '@atlaskit/adf-utils/types';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

import { Environment, Output } from '../common';
import { titleToPath, toExtension } from '../common/helpers';
import { Api, Content } from '../confluence-api';

import { rewriteUrl } from './helpers/rewrite-url';
import { mapContentToContentData } from './mappers';
import { saveContentData, saveContentTemplate } from './save-content';
import { ContentData, Extract, LeftNavigation, NavigationItem } from './types';

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
        const pages = await this.extractPageHierarchies(
            environment,
            output,
            publicFolder.children?.page.results ?? []
        );
        // extract left navigation
        await this.extractLeftNavigation(output, pages);
    }

    private async extractLeftNavigation(
        output: Output,
        pages: NavigationItem[]
    ): Promise<void> {
        console.info(`🗺️extract left navigation`);
        const paths = await this.resolveNavigationPaths(pages);
        const navigation: LeftNavigation = { pages, paths };
        fs.writeFileSync(
            path.resolve(output.site.home, 'left-navigation.json'),
            JSON.stringify(navigation, null, 2)
        );
    }

    private async resolveNavigationPaths(pages: NavigationItem[]) {
        const paths: Record<string, string> = {};
        const traversePages = (
            pageItems: NavigationItem[],
            parentPath = ''
        ) => {
            pageItems.forEach((page) => {
                if (parentPath !== '') {
                    paths[page.href] = parentPath;
                }
                const children = page.children ?? [];
                if (children.length > 0) {
                    paths[page.href] = page.href;
                    traversePages(children, page.href);
                }
            });
        };
        traversePages(pages);
        return paths;
    }

    private async extractPageHierarchies(
        environment: Environment,
        output: Output,
        contentItems: Content[]
    ): Promise<NavigationItem[]> {
        const pages: NavigationItem[] = [];
        for (const content of contentItems) {
            const parent = await this.extractContentItem(
                environment,
                output,
                content,
                false
            );
            const parentPage: NavigationItem = {
                id: content.id,
                title: content.title,
                type: 'page',
                href: `/pages/${titleToPath(content.title)}/`,
                emoji: content.metadata?.properties['emoji-title-published']
                    ?.value
            };
            const children = parent.children?.page?.results ?? [];
            if (children.length > 0) {
                parentPage.children = await this.extractPageHierarchies(
                    environment,
                    output,
                    children
                );
            }
            pages.push(parentPage);
        }
        return pages;
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
        const contentData = mapContentToContentData(environment, content);

        await this.extractContentAttachments(output, content);
        await this.extractContentEmojis(output, contentData);
        await this.extractContentObjects(environment, output, contentData);

        await saveContentTemplate(environment, output, contentData, asHomepage);
        await saveContentData(output, contentData, asHomepage);

        return content;
    }

    private async extractContentObjects(
        environment: Environment,
        output: Output,
        content: ContentData
    ) {
        const inlineCards = filter(
            content.body,
            (node) => node.type === 'inlineCard'
        ).map((item) => {
            return {
                resourceUrl: item.attrs?.url
            };
        });
        const blockCards = filter(
            content.body,
            (node) => node.type === 'blockCard'
        ).map((item) => {
            return {
                resourceUrl: item.attrs?.url
            };
        });

        const cards = [...inlineCards, ...blockCards];

        if (cards.length < 1) return;

        const resolvedObjects = await this.api.getObjects(cards);
        console.info(`🔗 resolved objects: ${resolvedObjects.length}`);
        resolvedObjects.forEach((item) => {
            if (!item.body) {
                return;
            }
            const data = item.body.data;
            const { url, name, generator, summary } = data;
            const definition = {
                name,
                generator,
                summary,
                url: rewriteUrl(environment, url),
                '@type': data['@type']
            };
            const urlHash = crypto
                .createHash('sha512')
                .update(definition.url)
                .digest('hex');

            fs.writeFileSync(
                path.resolve(output.site.assets.objects, `${urlHash}.json`),
                JSON.stringify(definition)
            );

            content.objects[definition.url] = urlHash;
        });
    }

    private async extractContentAttachments(
        output: Output,
        content: Content
    ): Promise<void[]> {
        const attachments = content.children?.attachment?.results ?? [];
        return Promise.all(
            attachments.map(async (attachment) => {
                return this.api
                    .getAttachmentData({
                        prefix: '/wiki',
                        targetUrl: attachment._links.download
                    })
                    .then(({ stream }) => {
                        const fileExtension = toExtension(
                            attachment.extensions.mediaType
                        );
                        const filePath = path.resolve(
                            output.site.attachments,
                            `${attachment.extensions.fileId}.${fileExtension}`
                        );
                        if (fileExtension !== '') {
                            const symlink = path.resolve(
                                output.site.attachments,
                                attachment.extensions.fileId
                            );
                            if (!fs.existsSync(symlink)) {
                                fs.symlinkSync(filePath, symlink);
                            }
                        }
                        const file = fs.createWriteStream(filePath);
                        return stream.pipe(file);
                    })
                    .catch(console.error);
            })
        );
    }

    private async extractContentEmojis(
        output: Output,
        contentData: ContentData
    ): Promise<void> {
        if (contentData.identifier.emoji) {
            await this.fetchEmoji(output, contentData.identifier.emoji);
        }

        const UUID_REGEX =
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

        traverse(contentData.body, {
            emoji: ({ attrs }: ADFEntity) => {
                if (!attrs || !attrs.id) return;
                if (UUID_REGEX.exec(attrs.id)) return;
                this.fetchEmoji(output, attrs.id);
            }
        });
    }

    private async fetchEmoji(output: Output, id: string) {
        const targetFile = path.resolve(output.site.assets.emojis, `${id}.png`);
        if (fs.existsSync(targetFile)) return;

        const targetUrl = id.startsWith('atlassian')
            ? `/atlassian/${id.split('-')[1]}_64.png`
            : `/standard/caa27a19-fc09-4452-b2b4-a301552fd69c/64x64/${id}.png`;

        this.emojiClient
            .get(targetUrl, { responseType: 'stream' })
            .then((response) => ({ stream: response.data }))
            .then(({ stream }) => {
                const file = fs.createWriteStream(targetFile);
                return stream.pipe(file);
            });
    }
}

export { ExtractClient };

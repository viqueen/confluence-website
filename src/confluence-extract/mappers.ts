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
import { Environment } from '../common';
import { titleToPath } from '../common/helpers';
import { Content, ContentMetadata } from '../confluence-api';

import { scrubContent } from './helpers/adf-processor';
import { BlogPostSummary, ContentData } from './types';

const mapContentToContentData = (
    environment: Environment,
    content: Content
): ContentData => {
    let contentBody = emptyContentBody;
    if (content.body && content.body.atlas_doc_format) {
        contentBody = JSON.parse(content.body.atlas_doc_format.value);
    }
    const childPages = content.children?.page?.results || [];
    const attachments = content.children?.attachment?.results || [];
    const metadata: Record<string, string | undefined> = {
        emoji: content.metadata?.properties['emoji-title-published']?.value,
        coverUrl: getCoverUrl(content.metadata)
    };
    return {
        identifier: {
            id: content.id,
            title: content.title,
            type: content.type,
            ...metadata
        },
        body: scrubContent(environment, contentBody),
        childPages: childPages.map(({ id, title, type, metadata }) => ({
            id,
            title,
            type,
            emoji: metadata?.properties['emoji-title-published']?.value,
            coverUrl: getCoverUrl(metadata)
        })),
        attachments: attachments.map(({ extensions, _links }) => ({
            fileId: extensions.fileId,
            mediaType: extensions.mediaType,
            downloadUrl: _links.download
        })),
        objects: {}
    };
};

const mapContentToBlogPostSummary = (content: Content): BlogPostSummary => {
    const createdAt = new Date(content.history?.createdDate || 0);
    const createdDate = createdAt.getTime();
    const createdYear = createdAt.getFullYear();
    return {
        identifier: {
            id: content.id,
            title: content.title,
            type: content.type,
            emoji: content.metadata?.properties['emoji-title-published']?.value,
            coverUrl: getCoverUrl(content.metadata)
        },
        href: `/blogs/${titleToPath(content.title)}/`,
        createdDate,
        createdYear
    };
};

const getCoverUrl = (metadata?: ContentMetadata): string | undefined => {
    const cover = metadata?.properties['cover-picture-id-published']?.value;
    if (cover) {
        const parsed = JSON.parse(cover);
        return parsed.id;
    }
};

const emptyContentBody = {
    version: 1,
    type: 'doc',
    content: []
};

export { mapContentToContentData, mapContentToBlogPostSummary };

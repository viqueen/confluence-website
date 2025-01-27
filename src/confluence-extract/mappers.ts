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
import { Content } from '../confluence-api';

import { scrubContent } from './helpers/adf-processor';
import { ContentData } from './types';

const mapContentToContentData = (
    environment: Environment,
    content: Content
): ContentData => {
    let contentBody = emptyContentBody;
    if (content.body && content.body.atlas_doc_format) {
        contentBody = JSON.parse(content.body.atlas_doc_format.value);
    }
    const childPages = content.children?.page.results || [];
    const attachments = content.children?.attachment.results || [];
    const metadata: Record<string, string | undefined> = {
        emoji: content.metadata?.properties['emoji-title-published']?.value
    };
    const cover =
        content.metadata?.properties['cover-picture-id-published']?.value;
    if (cover) {
        const parsed = JSON.parse(cover);
        metadata['coverUrl'] = parsed.id;
    }
    return {
        identifier: {
            id: content.id,
            title: content.title,
            type: content.type,
            ...metadata
        },
        body: scrubContent(environment, contentBody),
        childPages: childPages.map(({ id, title, type }) => ({
            id,
            title,
            type
        })),
        attachments: attachments.map(({ extensions, _links }) => ({
            fileId: extensions.fileId,
            mediaType: extensions.mediaType,
            downloadUrl: _links.download
        })),
        objects: {}
    };
};

const emptyContentBody = {
    version: 1,
    type: 'doc',
    content: []
};

export { mapContentToContentData };

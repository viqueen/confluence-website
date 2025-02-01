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

import { Environment, Output } from '../common';
import { Content } from '../confluence-api';

import { extractContentAttachments } from './extract-content-attachments';
import { extractContentAvatars } from './extract-content-avatars';
import { extractContentEmojis } from './extract-content-emojis';
import { extractContentObjects } from './extract-content-objects';
import { mapSearchResultItemToContentData } from './mappers';
import { saveContentData, saveContentTemplate } from './save-content';
import { Clients } from './types';

const extractContent = async (
    clients: Clients,
    environment: Environment,
    output: Output,
    contentId: number,
    asHomepage: boolean
): Promise<Content> => {
    console.info(`📄 extract content: ${contentId}`);
    const response = await clients.confluence.searchContent(contentId);
    const resultItem = response.results[0];
    if (!resultItem) {
        throw Error('❌ content not found');
    }
    const contentData = mapSearchResultItemToContentData(
        environment,
        resultItem
    );

    await extractContentAttachments(
        clients.confluence,
        output,
        resultItem.content
    );
    await extractContentAvatars(clients.confluence, output, resultItem.content);
    await extractContentObjects(
        clients.confluence,
        environment,
        output,
        contentData
    );
    await extractContentEmojis(clients.emoji, output, contentData);

    await saveContentTemplate(environment, output, contentData, asHomepage);
    await saveContentData(output, contentData, asHomepage);

    return resultItem.content;
};

export { extractContent };

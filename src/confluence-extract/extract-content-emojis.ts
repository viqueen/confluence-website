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
import fs from 'fs';
import path from 'path';

import { traverse } from '@atlaskit/adf-utils/traverse';
import { ADFEntity } from '@atlaskit/adf-utils/types';
import type { AxiosInstance } from 'axios';

import { Output } from '../common';

import { ContentData } from './types';

const extractContentEmojis = async (
    emojiClient: AxiosInstance,
    output: Output,
    contentData: ContentData
): Promise<void> => {
    if (contentData.identifier.emoji) {
        await fetchEmoji(emojiClient, output, contentData.identifier.emoji);
    }

    const UUID_REGEX =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

    traverse(contentData.body, {
        emoji: ({ attrs }: ADFEntity) => {
            if (!attrs || !attrs.id) return;
            if (UUID_REGEX.exec(attrs.id)) return;
            fetchEmoji(emojiClient, output, attrs.id);
        }
    });
};

const fetchEmoji = async (
    emojis: AxiosInstance,
    output: Output,
    id: string
) => {
    const targetFile = path.resolve(output.site.assets.emojis, `${id}.png`);
    if (fs.existsSync(targetFile)) return;

    const targetUrl = id.startsWith('atlassian')
        ? `/atlassian/${id.split('-')[1]}_64.png`
        : `/standard/caa27a19-fc09-4452-b2b4-a301552fd69c/64x64/${id}.png`;

    emojis
        .get(targetUrl, { responseType: 'stream' })
        .then((response) => ({ stream: response.data }))
        .then(({ stream }) => {
            const file = fs.createWriteStream(targetFile);
            return stream.pipe(file);
        });
};

export { extractContentEmojis };

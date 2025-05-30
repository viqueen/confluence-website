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

import { filter } from '@atlaskit/adf-utils/traverse';

import { Environment, Output } from '../common';
import { Api } from '../confluence-api';

import { rewriteUrl } from './helpers/rewrite-url';
import { ContentData } from './types';

const extractContentObjects = async (
    confluence: Api,
    environment: Environment,
    output: Output,
    content: ContentData
) => {
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

    const resolvedObjects = await confluence.getObjects(cards);
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
};

export { extractContentObjects };

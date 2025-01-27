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
import { extension } from '@atlaskit/adf-utils/builders';
import { scrubAdf } from '@atlaskit/adf-utils/scrub';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

import { Environment } from '../../common';

import { rewriteUrl } from './rewrite-url';

const identityProcessor = (node: ADFEntity) => {
    return node;
};

const cardProcessor = (environment: Environment) => (node: ADFEntity) => {
    const url = rewriteUrl(environment, node.attrs?.url);
    return {
        type: 'text',
        text: url,
        marks: [
            {
                type: 'link',
                attrs: {
                    href: url
                }
            }
        ]
    };
};

const mediaSingleProcessor = (node: ADFEntity) => {
    return extension({
        extensionType: 'org.viqueen.media',
        extensionKey: 'file',
        parameters: {
            ...node.attrs,
            data: node.content
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrubContent = (environment: Environment, doc: any) => {
    return scrubAdf(doc, {
        nodeReplacements: {
            blockCard: cardProcessor(environment),
            bulletList: identityProcessor,
            codeBlock: identityProcessor,
            date: identityProcessor,
            emoji: identityProcessor,
            expand: identityProcessor,
            extension: identityProcessor,
            heading: identityProcessor,
            inlineCard: cardProcessor(environment),
            inlineExtension: identityProcessor,
            media: identityProcessor,
            mediaSingle: mediaSingleProcessor,
            panel: identityProcessor,
            paragraph: identityProcessor,
            status: identityProcessor,
            table: identityProcessor,
            tableCell: identityProcessor,
            tableHeader: identityProcessor,
            tableRow: identityProcessor,
            text: identityProcessor
        }
    });
};

export { scrubContent };

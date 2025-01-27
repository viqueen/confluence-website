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
import { Environment } from '../common';
import { Content } from '../confluence-api';

import { scrubContent } from './helpers/adf-processor';
import { ContentData } from './types';

const mapContentToContentData = (
    environment: Environment,
    content: Content
): ContentData => {
    if (!content.body?.atlas_doc_format) {
        return {
            id: content.id,
            title: content.title,
            type: content.type,
            body: emptyContentBody
        };
    }
    const body = JSON.parse(content.body.atlas_doc_format.value);
    const scrubbed = scrubContent(environment, body);
    return {
        id: content.id,
        title: content.title,
        type: content.type,
        body: scrubbed
    };
};

const emptyContentBody = {
    version: 1,
    type: 'doc',
    content: []
};

export { mapContentToContentData };

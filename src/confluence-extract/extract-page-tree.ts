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
import { titleToPath } from '../common/helpers';
import { Content } from '../confluence-api';

import { extractContent } from './extract-content';
import { Clients, NavigationItem } from './types';

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
const extractPageTree = async (
    clients: Clients,
    environment: Environment,
    output: Output,
    contentItems: Content[]
): Promise<NavigationItem[]> => {
    const pages: NavigationItem[] = [];
    for (const content of contentItems) {
        const parent = await extractContent(
            clients,
            environment,
            output,
            content.id,
            false
        );
        const parentPage: NavigationItem = {
            id: content.id,
            title: content.title,
            type: 'page',
            href: `/pages/${titleToPath(content.title)}/`,
            emoji: content.metadata?.properties['emoji-title-published']?.value
        };
        const children = parent.children?.page?.results ?? [];
        if (children.length > 0) {
            parentPage.children = await extractPageTree(
                clients,
                environment,
                output,
                children
            );
        }
        pages.push(parentPage);
    }
    return pages;
};

export { extractPageTree };

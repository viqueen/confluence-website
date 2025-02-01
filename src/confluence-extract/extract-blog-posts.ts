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

import { Environment, Output } from '../common';
import { titleToPath } from '../common/helpers';
import { SearchResultItem } from '../confluence-api';

import { extractContent } from './extract-content';
import { mapSearchResultItemToBlogPostSummary } from './mappers';
import { Clients, NavigationItem } from './types';

const extractBlogPosts = async (
    clients: Clients,
    environment: Environment,
    output: Output,
    blogPosts: SearchResultItem[]
): Promise<Record<number, NavigationItem[]>> => {
    console.info(`📚 extract blog posts: ${blogPosts.length}`);

    for (const blogPost of blogPosts) {
        await extractContent(
            clients,
            environment,
            output,
            blogPost.content.id,
            false
        );
    }

    const blogs = blogPosts.map(mapSearchResultItemToBlogPostSummary);
    fs.writeFileSync(
        path.resolve(output.site.home, 'blogs.json'),
        JSON.stringify(blogs, null, 2)
    );

    return blogs.reduce(
        (prev, current) => {
            const byYear = prev[current.createdYear] || [];
            byYear.push({
                id: current.identifier.id,
                title: current.identifier.title,
                type: 'blogpost',
                href: `/blogs/${titleToPath(current.identifier.title)}/`,
                emoji: current.identifier.emoji
            });
            prev[current.createdYear] = byYear;
            return prev;
        },
        {} as Record<number, NavigationItem[]>
    );
};

export { extractBlogPosts };

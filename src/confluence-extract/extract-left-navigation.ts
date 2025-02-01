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

import { Output } from '../common';

import { LeftNavigation, NavigationItem } from './types';

const extractLeftNavigation = async (
    output: Output,
    pages: NavigationItem[],
    blogs: Record<number, NavigationItem[]>
): Promise<void> => {
    console.info(`🗺️extract left navigation`);
    const paths = await resolveNavigationPaths(pages, blogs);
    const navigation: LeftNavigation = { pages, blogs, paths };
    fs.writeFileSync(
        path.resolve(output.site.home, 'left-navigation.json'),
        JSON.stringify(navigation, null, 2)
    );
};

const resolveNavigationPaths = async (
    pages: NavigationItem[],
    blogs: Record<number, NavigationItem[]>
): Promise<Record<string, string>> => {
    const paths: Record<string, string> = {};
    const traversePages = (pageItems: NavigationItem[], parentPath = '') => {
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
    for (const year in blogs) {
        const blogPosts = blogs[year];
        blogPosts.forEach((blogPost) => {
            paths[blogPost.href] = `/blogs/${year}/`;
        });
    }
    return paths;
};

export { extractLeftNavigation };

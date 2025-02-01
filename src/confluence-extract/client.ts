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

import axios from 'axios';

import { Environment, Output } from '../common';
import { ApiClient } from '../confluence-api';

import { extractBlogPosts } from './extract-blog-posts';
import { extractContent } from './extract-content';
import { extractLeftNavigation } from './extract-left-navigation';
import { extractPageTree } from './extract-page-tree';
import { Clients, Extract } from './types';

class ExtractClient implements Extract {
    constructor() {}

    async extractSpace(
        environment: Environment,
        output: Output,
        spaceKey: string
    ): Promise<void> {
        const clients: Clients = {
            confluence: new ApiClient({
                baseUrl: `https://${environment.CONFLUENCE_SITE_NAME}`,
                username: environment.CONFLUENCE_USERNAME,
                apiToken: environment.CONFLUENCE_API_TOKEN
            }),
            emoji: axios.create({
                baseURL:
                    'https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net'
            })
        };

        console.info(`🪐 extract space: ${spaceKey}`);
        const space = await clients.confluence.getSpace(spaceKey);

        const homepage = space.homepage;
        if (!homepage) {
            throw Error('❌ homepage not found');
        }

        const publicFolderResponse =
            await clients.confluence.searchSpacePublicFolder(spaceKey);
        const publicFolder = publicFolderResponse.results[0]?.content;
        if (!publicFolder) {
            throw Error('❌ public folder not found');
        }

        // extract homepage
        await extractContent(clients, environment, output, homepage.id, true);

        // extract public folder
        const pages = await extractPageTree(
            clients,
            environment,
            output,
            publicFolder.children?.page?.results ?? []
        );

        // extract blog posts
        const blogPostsResponse =
            await clients.confluence.searchSpaceBlogPosts(spaceKey);
        const blogPosts = blogPostsResponse.results;

        const blogs = await extractBlogPosts(
            clients,
            environment,
            output,
            blogPosts
        );

        // extract left navigation
        await extractLeftNavigation(output, pages, blogs);
    }
}

export { ExtractClient };

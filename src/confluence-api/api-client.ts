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
import type { AxiosInstance } from 'axios';

import { axiosErrorHandler } from './axios-error-handler';
import {
    Api,
    AttachmentData,
    ResourceDefinition,
    ResourceObject,
    SearchResponse,
    Space
} from './types';

interface ApiClientProps {
    baseUrl: string;
    username: string;
    apiToken: string;
}

class ApiClient implements Api {
    private readonly client: AxiosInstance;

    constructor(props: ApiClientProps) {
        this.client = axios.create({
            baseURL: props.baseUrl,
            auth: {
                username: props.username,
                password: props.apiToken
            }
        });
    }

    async getSpace(spaceKey: string): Promise<Space> {
        return this.client
            .get<Space>(`/wiki/rest/api/space/${spaceKey}`, {
                params: {
                    expand: 'homepage'
                }
            })
            .then((response) => response.data)
            .catch(axiosErrorHandler);
    }

    async searchContent(contentId: number): Promise<SearchResponse> {
        const contentExpansions = [
            'content.body.atlas_doc_format',
            'content.children.page',
            'content.children.attachment',
            'content.metadata.properties.emoji_title_published'
        ];
        return this.client
            .get<SearchResponse>(`/wiki/rest/api/search`, {
                params: {
                    cql: `id = ${contentId}`,
                    expand: contentExpansions.join(',')
                }
            })
            .then((response) => response.data)
            .catch(axiosErrorHandler);
    }

    async searchSpacePublicFolder(spaceKey: string): Promise<SearchResponse> {
        const contentExpansions = [
            'content.children.page',
            'content.children.page.metadata.properties.emoji_title_published'
        ];
        return this.client
            .get<SearchResponse>(`/wiki/rest/api/search`, {
                params: {
                    cql: `space = "${spaceKey}" and type = "folder" and title = "public"`,
                    expand: contentExpansions.join(',')
                }
            })
            .then((response) => response.data)
            .catch(axiosErrorHandler);
    }

    async getAttachmentData({
        prefix,
        targetUrl
    }: {
        prefix: string;
        targetUrl: string;
    }): Promise<AttachmentData> {
        const { data } = await this.client
            .get(`${prefix}${targetUrl}`, { responseType: 'stream' })
            .catch(axiosErrorHandler);
        return { stream: data };
    }

    async getObjects(
        resources: ResourceObject[]
    ): Promise<{ body: { data: ResourceDefinition } }[]> {
        const { data } = await this.client
            .post(`/gateway/api/object-resolver/resolve/batch`, resources, {
                headers: {
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin'
                }
            })
            .catch(axiosErrorHandler);
        return data;
    }
}

export type { ApiClientProps };
export { ApiClient };

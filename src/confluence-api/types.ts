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
interface Api {
    getSpace(spaceKey: string): Promise<Space>;
    searchSpacePublicFolder(spaceKey: string): Promise<SearchResponse>;
    searchSpaceBlogPosts(spaceKey: string): Promise<SearchResponse>;
    searchContent(contentId: number): Promise<SearchResponse>;
    getAttachmentData(input: {
        prefix: string;
        targetUrl: string;
    }): Promise<AttachmentData>;
    getObjects(
        resources: ResourceObject[]
    ): Promise<{ body: { data: ResourceDefinition } }[]>;
}

interface ResourceObject {
    resourceUrl: string;
}

interface ResourceDefinition {
    url: string;
    generator: { icon: { url: string } };
    name: string;
    summary?: string;
    '@type': string;
}

interface AttachmentData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stream: any;
}

interface Space {
    id: number;
    key: string;
    name: string;
    homepage?: Content;
}

interface Content {
    id: number;
    type: 'page' | 'blogpost' | 'folder';
    title: string;
    body?: ContentBody;
    children?: ContentChildren;
    metadata?: ContentMetadata;
}

interface ContentBody {
    atlas_doc_format: {
        value: string;
    };
}

interface ContentMetadata {
    properties: {
        'emoji-title-published'?: {
            value: string;
        };
        'cover-picture-id-published'?: {
            value: string;
        };
    };
}

interface File {
    extensions: {
        fileId: string;
        mediaType: string;
    };
    _links: {
        download: string;
    };
}

interface ContentChildren {
    page: {
        results: Content[];
    };
    attachment: {
        results: File[];
    };
}

interface SearchResponse {
    results: SearchResultItem[];
}

interface SearchResultItem {
    content: Content;
}

export type {
    Api,
    AttachmentData,
    Space,
    Content,
    ContentBody,
    ContentMetadata,
    SearchResultItem,
    SearchResponse,
    ContentChildren,
    ResourceDefinition,
    ResourceObject
};

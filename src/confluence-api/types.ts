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
interface Api {
    getSpace(spaceKey: string): Promise<Space>;
    searchSpacePublicFolder(spaceKey: string): Promise<SearchResponse>;
    searchContent(contentId: number): Promise<SearchResponse>;
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
}

interface ContentBody {
    atlas_doc_format: {
        value: string;
    };
}

interface ContentChildren {
    page: {
        results: Content[];
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
    Space,
    Content,
    ContentBody,
    SearchResultItem,
    SearchResponse,
    ContentChildren
};

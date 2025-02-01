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

interface Extract {
    extractSpace(
        environment: Environment,
        output: Output,
        spaceKey: string
    ): Promise<void>;
}

interface ContentIdentifier {
    id: number;
    title: string;
    type: 'page' | 'blogpost' | 'folder';
    emoji?: string;
    coverUrl?: string;
}

interface Attachment {
    fileId: string;
    mediaType: string;
    downloadUrl: string;
}

interface Author {
    id: string;
    title: string;
}

interface ContentData {
    identifier: ContentIdentifier;
    author: Author;
    excerpt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    childPages: ContentIdentifier[];
    attachments: Attachment[];
    objects: Record<string, string>;
}

interface BlogPostSummary {
    identifier: ContentIdentifier;
    author: Author;
    excerpt: string;
    href: string;
    createdDate: number;
    createdYear: number;
}

interface NavigationItem extends ContentIdentifier {
    href: string;
    children?: NavigationItem[];
}

interface LeftNavigation {
    pages: NavigationItem[];
    blogs: Record<string, NavigationItem[]>; // year -> blogposts
    paths: Record<string, string>;
}

export type { Extract };
export type {
    ContentData,
    LeftNavigation,
    NavigationItem,
    ContentIdentifier,
    Attachment,
    BlogPostSummary
};

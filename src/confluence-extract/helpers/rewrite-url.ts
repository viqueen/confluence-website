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
import { Environment } from '../../common';

const isInternalUrl = (environment: Environment, url: string): boolean => {
    return url.startsWith(`https://${environment.CONFLUENCE_SITE_NAME}`);
};

const blogUrl =
    /https:\/\/[a-z.]+\/wiki\/spaces\/[a-zA-Z0-9]+\/blog\/\d+\/\d+\/\d+\/(?<id>\d+)/;

const pageUrl =
    /https:\/\/[a-z.]+\/wiki\/spaces\/[a-zA-Z0-9]+\/pages\/(?<id>\d+)/;

export const rewriteUrl = (environment: Environment, url: string): string => {
    if (!isInternalUrl(environment, url)) {
        return url;
    }
    const isBlog = blogUrl.exec(url);
    if (isBlog) {
        return `${environment.domainUrl()}/blogs/${isBlog.groups?.id}/`;
    }
    const isPage = pageUrl.exec(url);
    if (isPage) {
        return `${environment.domainUrl()}/pages/${isPage.groups?.id}/`;
    }
    return url;
};

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
import fs from 'fs';
import path from 'path';

import ReactDOMServer from 'react-dom/server';

import { Environment, Output } from '../common';
import { Content } from '../confluence-api';
import { StaticWrapper } from '../static-wrapper';

import { mapContentToContentData } from './mappers';

const saveContentData = async (
    output: Output,
    content: Content,
    asHomepage: boolean
) => {
    const target = resolvePath(output, content, asHomepage, 'data');
    const contentData = mapContentToContentData(content);
    const asJson = JSON.stringify(contentData, null, 2);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.resolve(target, 'data.json'), asJson);
};

const saveContentTemplate = async (
    environment: Environment,
    output: Output,
    content: Content,
    asHomepage: boolean
) => {
    const target = resolvePath(output, content, asHomepage, 'template');
    const indexHtml = ReactDOMServer.renderToStaticMarkup(
        StaticWrapper(environment, content)
    );
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.resolve(target, 'index.html'), indexHtml);
};

const resolvePath = (
    output: Output,
    content: Content,
    asHomepage: boolean,
    target: 'data' | 'template'
) => {
    if (target === 'data') {
        if (asHomepage) {
            return path.resolve(output.site.home);
        }
        return path.resolve(
            output.site[content.type],
            titleToPath(content.title)
        );
    }
    if (target === 'template') {
        if (asHomepage) {
            return path.resolve(output.templates.home);
        }
        return path.resolve(
            output.templates[content.type],
            titleToPath(content.title)
        );
    }
    throw Error('invalid target');
};

const titleToPath = (title: string): string => {
    const noSpaces = title.replace(/\s+/g, '-');
    return noSpaces.replace(/[,?]/g, '');
};

export { saveContentData, saveContentTemplate };

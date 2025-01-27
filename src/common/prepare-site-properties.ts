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

import type { GenerateThemeArgs } from '@atlaskit/atlassian-navigation';

interface SiteProperties {
    title: string;
    iconUrl: string;
    name: string;
    theme: GenerateThemeArgs & { mode: 'light' | 'dark' };
}

const defaultSiteProperties: SiteProperties = {
    title: 'confluence-website',
    iconUrl: '',
    name: '/website',
    theme: {
        name: 'confluence-website',
        backgroundColor: 'rgb(0, 102, 68)',
        highlightColor: '#FFFFFF',
        mode: 'light'
    }
};

const prepareSiteProperties = (): SiteProperties => {
    const file = path.resolve(process.cwd(), '.confluence-website.json');
    if (!fs.existsSync(file)) {
        return defaultSiteProperties;
    }
    const data = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(data); // TODO: handle validation
    return parsed as SiteProperties;
};

export type { SiteProperties };
export { defaultSiteProperties, prepareSiteProperties };

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
import dotenv from 'dotenv';

interface Environment {
    CONFLUENCE_SITE_NAME: string;
    CONFLUENCE_USERNAME: string;
    CONFLUENCE_API_TOKEN: string;
    CUSTOM_DOMAIN: string;
    VERCEL_URL: string;

    domainUrl: () => string;
}

const prepareEnvironment = (): Environment => {
    const parsed = (dotenv.config().parsed || {}) as unknown as Environment;
    return {
        CONFLUENCE_SITE_NAME:
            parsed.CONFLUENCE_SITE_NAME ?? process.env.CONFLUENCE_SITE_NAME,
        CONFLUENCE_USERNAME:
            parsed.CONFLUENCE_USERNAME ?? process.env.CONFLUENCE_USERNAME,
        CONFLUENCE_API_TOKEN:
            parsed.CONFLUENCE_API_TOKEN ?? process.env.CONFLUENCE_API_TOKEN,
        CUSTOM_DOMAIN: parsed.CUSTOM_DOMAIN ?? process.env.CUSTOM_DOMAIN,
        VERCEL_URL: parsed.VERCEL_URL ?? process.env.VERCEL_URL,

        domainUrl: () => {
            if (!parsed.CUSTOM_DOMAIN) {
                return `https://${parsed.VERCEL_URL}`;
            }
            return parsed.CUSTOM_DOMAIN;
        }
    };
};

export { prepareEnvironment };
export type { Environment };

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
import { Environment, Output } from '../../common';
import { ApiClient } from '../../confluence-api';
import { ExtractClient } from '../../confluence-extract';

const commandExtractSpace = async (
    environment: Environment,
    output: Output,
    spaceKey: string
) => {
    const api = new ApiClient({
        baseUrl: `https://${environment.CONFLUENCE_SITE_NAME}`,
        username: environment.CONFLUENCE_USERNAME,
        apiToken: environment.CONFLUENCE_API_TOKEN
    });
    const client = new ExtractClient(api);
    await client.extractSpace(environment, output, spaceKey);
};

export { commandExtractSpace };

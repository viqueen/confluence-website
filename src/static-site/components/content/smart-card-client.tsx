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
import { CardClient } from "@atlaskit/link-provider";
import { JsonLd } from "json-ld-types";

class SimpleCardClient extends CardClient {
  async fetchData(url: string, _force?: boolean): Promise<JsonLd.Response> {
    return {
      meta: {
        access: "granted",
        visibility: "public",
      },
      data: {
        "@type": "Object",
        "@context": {
          "@vocab": "https://www.w3.org/ns/activitystreams#",
          atlassian: "https://schema.atlassian.com/ns/vocabulary#",
          schema: "http://schema.org/",
        },
        name: url,
        url,
      },
    } as JsonLd.Response;
  }

  async prefetchData(_url: string): Promise<JsonLd.Response | undefined> {
    return undefined;
  }
}

export { SimpleCardClient };

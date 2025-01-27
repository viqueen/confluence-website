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
import { CardClient } from "@atlaskit/link-provider";
import axios from "axios";
import { JsonLd } from "json-ld-types";

import { ContentData } from "../../../confluence-extract";

class SimpleCardClient extends CardClient {
  constructor(private readonly content: ContentData) {
    super();
  }
  async fetchData(url: string, _force?: boolean): Promise<JsonLd.Response> {
    const cardHash = this.content.objects[url];
    if (!cardHash) {
      throw new Error("Invalid URL");
    }
    const { data } = await axios.get(`/assets/objects/${cardHash}.json`);
    return {
      meta: {
        access: "granted",
        visibility: "public",
      },
      data,
    } as JsonLd.Response;
  }

  async prefetchData(_url: string): Promise<JsonLd.Response | undefined> {
    return undefined;
  }
}

export { SimpleCardClient };

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
import React from "react";
import { IntlProvider } from "react-intl-next";

import { CardClient, SmartCardProvider } from "@atlaskit/link-provider";
import { ReactRenderer } from "@atlaskit/renderer";
import { JsonLd } from "json-ld-types";

import { ContentData } from "../../../confluence-extract";

import { dataProviders } from "./data-providers";
import { extensionHandlers } from "./extension-handlers";

const ContentRenderer = ({ content }: { content: ContentData }) => {
  return (
    <SmartCardProvider client={new SimpleCardClient()}>
      <IntlProvider locale="en">
        <ReactRenderer
          document={content.body}
          dataProviders={dataProviders()}
          extensionHandlers={extensionHandlers(content)}
        />
      </IntlProvider>
    </SmartCardProvider>
  );
};

class SimpleCardClient extends CardClient {
  async fetchData(url: string, _force?: boolean): Promise<JsonLd.Response> {
    return {
      meta: {
        access: "granted",
        visibility: "public",
      },
      data: {
        name: url,
        url,
      },
    } as JsonLd.Response;
  }

  async prefetchData(_url: string): Promise<JsonLd.Response | undefined> {
    return undefined;
  }
}

export { ContentRenderer };

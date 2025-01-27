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
import React from "react";

import { Environment } from "../common";
import { Content } from "../confluence-api";

import { withOpenGraphSeo } from "./with-open-graph-seo";

const StaticWrapper = (environment: Environment, content: Content) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        {withOpenGraphSeo(content, environment)}
        <title>{content.title}</title>
      </head>
      <body>
        <div id="root" />
      </body>
    </html>
  );
};

export { StaticWrapper };

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
import { unescapeExcerpt } from "../common/helpers";
import { ContentData } from "../confluence-extract";

const withOpenGraphSeo = (environment: Environment, content: ContentData) => {
  const excerpt = unescapeExcerpt(content.excerpt);
  const ogUrl = resolveOgUrl(environment, content);
  return (
    <>
      <meta name="og:title" content={content.identifier.title} />
      <meta property="og:title" content={content.identifier.title} />
      <meta name="og:description" content={excerpt} />
      <meta property="og:description" content={excerpt} />
      <meta name="og:url" content={ogUrl} />
      <meta property="og:url" content={ogUrl} />
    </>
  );
};

const resolveOgUrl = (environment: Environment, content: ContentData) => {
  if (content.identifier.type === "page") {
    return `${environment.domainUrl()}/pages/${content.identifier.id}/`;
  }
  return `${environment.domainUrl()}/blogs/${content.identifier.id}/`;
};

export { withOpenGraphSeo };

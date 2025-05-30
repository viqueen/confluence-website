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

import type {
  ExtensionParams,
  Parameters,
} from "@atlaskit/editor-common/extensions";

import { ContentData } from "../../../../../confluence-extract";

import { BlogPostsMarco } from "./blog-posts-marco";
import { ChildrenMacro } from "./children-macro";
import { MacroWarning } from "./macro-warning";

const confluenceMacroCore = (content: ContentData) => {
  return (ext: ExtensionParams<Parameters>) => {
    switch (ext.extensionKey) {
      case "blog-posts":
        return <BlogPostsMarco />;
      case "children":
        return (
          <ChildrenMacro
            content={content}
            parent={ext.parameters?.macroParams.page?.value}
          />
        );
      default:
        return (
          <MacroWarning
            message={`${ext.extensionKey} extension not supported`}
          />
        );
    }
  };
};

export { confluenceMacroCore };

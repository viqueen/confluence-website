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

import { MediaFile } from "./media-file";

const viqueenMedia = (ext: ExtensionParams<Parameters>) => {
  if (ext.extensionKey !== "file") {
    console.warn("** missing media extension handler", ext.extensionKey, ext);
    return null;
  }
  const layout = ext.parameters?.layout;
  const attrs = ext.parameters?.data[0].attrs;
  const width = ext.parameters?.width;
  return (
    <MediaFile
      fileId={attrs.id}
      width={width}
      height={attrs.height}
      layout={layout}
    />
  );
};

export { viqueenMedia };

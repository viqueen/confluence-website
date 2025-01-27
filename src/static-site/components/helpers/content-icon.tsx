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

import PageIcon from "@atlaskit/icon/core/page";
import QuotationMarkIcon from "@atlaskit/icon/core/quotation-mark";

import { ContentIdentifier } from "../../../confluence-extract";

const ContentIcon = ({ identifier }: { identifier: ContentIdentifier }) => {
  if (identifier.emoji) {
    return (
      <span>
        <img
          alt={identifier.emoji}
          src={`/assets/emojis/${identifier.emoji}.png`}
          height={24}
          width={24}
        />
      </span>
    );
  }
  switch (identifier.type) {
    case "page":
      return <PageIcon label={identifier.title} />;
    case "blogpost":
      return <QuotationMarkIcon label={identifier.title} />;
    default:
      return null;
  }
};

export { ContentIcon };

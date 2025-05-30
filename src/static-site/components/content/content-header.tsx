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

import Heading from "@atlaskit/heading";

import { ContentData } from "../../../confluence-extract";
import "./content-header.css";
import { ContentIcon } from "../helpers";

const ContentHeader = ({ content }: { content: ContentData }) => {
  return (
    <div className={"content-header"}>
      <ContentIcon identifier={content.identifier} />
      <Heading size={"large"}>{content.identifier.title}</Heading>
    </div>
  );
};

export { ContentHeader };

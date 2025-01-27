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

import { Grid, GridColumn } from "@atlaskit/page";

import { Content } from "../../../confluence-api";

import { ContentAncestors } from "./content-ancestors";
import { ContentByLine } from "./content-by-line";
import { ContentCover } from "./content-cover";
import { ContentHeader } from "./content-header";
import { ContentRenderer } from "./content-renderer";

const ContentLayout = ({ content }: { content: Content }) => {
  return (
    <div>
      <ContentAncestors content={content} />
      <ContentCover content={content} />
      <Grid layout="fixed">
        <GridColumn medium={12}>
          <ContentHeader content={content} />
        </GridColumn>
        <GridColumn medium={12}>
          <ContentByLine content={content} />
          <ContentRenderer content={content} />
        </GridColumn>
      </Grid>
    </div>
  );
};

export { ContentLayout };

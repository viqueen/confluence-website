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

import Flag from "@atlaskit/flag";
import ErrorIcon from "@atlaskit/icon/core/error";

const ContentError = () => {
  return (
    <Flag
      id="content-error"
      appearance="error"
      title="We couldn't load the content"
      icon={<ErrorIcon label="Error" />}
    />
  );
};

export { ContentError };

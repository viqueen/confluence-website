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
import {
  AtlassianNavigation,
  CustomProductHome,
  generateTheme,
  PrimaryButton,
} from "@atlaskit/atlassian-navigation";
import React, { ReactNode } from "react";

import { siteProperties } from "./site-properties";

const HomeLink = () => {
  return (
    <a href="/" style={{ textDecoration: "none" }}>
      <PrimaryButton isHighlighted={true}>{siteProperties.title}</PrimaryButton>
    </a>
  );
};

const Home = () => {
  return (
    <CustomProductHome
      iconAlt={siteProperties.title}
      iconUrl={siteProperties.iconUrl}
      logoAlt={siteProperties.title}
      logoUrl={siteProperties.iconUrl}
    />
  );
};

const SiteTopNavigation = () => {
  const theme = generateTheme(siteProperties.theme);
  const items = [<HomeLink key={0} />] as ReadonlyArray<ReactNode>;

  return (
    <AtlassianNavigation
      label={siteProperties.name}
      primaryItems={items}
      renderProductHome={Home}
      theme={theme}
    />
  );
};

export { SiteTopNavigation };

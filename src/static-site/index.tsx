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

import AppProvider from "@atlaskit/app-provider";
import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  TopNavigation,
} from "@atlaskit/page-layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "@atlaskit/css-reset/dist/bundle.css";
import {
  SiteContent,
  SiteLeftNavigation,
  siteProperties,
  SiteTopNavigation,
} from "./components";

const Site = () => {
  return (
    <AppProvider defaultColorMode={siteProperties.theme.mode}>
      <PageLayout>
        <TopNavigation>
          <SiteTopNavigation />
        </TopNavigation>
        <Content>
          <LeftSidebar>
            <SiteLeftNavigation />
          </LeftSidebar>
          <Main>
            <SiteContent />
          </Main>
        </Content>
      </PageLayout>
      <Analytics />
      <SpeedInsights />
    </AppProvider>
  );
};

const rootContainer = document.querySelector("#root");
if (rootContainer) {
  if (rootContainer.hasChildNodes()) {
    hydrateRoot(rootContainer, <Site />);
  } else {
    createRoot(rootContainer).render(<Site />);
  }
}

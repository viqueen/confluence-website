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
import React, { useEffect, useState } from "react";

import LibraryIcon from "@atlaskit/icon/core/library";
import {
  Header,
  LinkItem,
  NavigationHeader,
  NestableNavigationContent,
  Section,
  SideNavigation,
} from "@atlaskit/side-navigation";
import axios from "axios";

import { LeftNavigation, NavigationItem } from "../../confluence-extract";

import { ContentIcon } from "./helpers";
import { siteProperties } from "./site-properties";

const SiteLeftNavigation = () => {
  const [leftNav, setLeftNav] = useState<LeftNavigation>({ pages: [] });
  const [stack] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<LeftNavigation>("/left-navigation.json");
      return data;
    };
    fetchData()
      .then((data) => {
        setLeftNav(data);
      })
      .catch(console.error);
  }, []);

  return (
    <SideNavigation label="site navigation">
      <NavigationHeader>
        <Header iconBefore={<LibraryIcon label={"library"} />}>
          {siteProperties.name}
        </Header>
      </NavigationHeader>
      <NestableNavigationContent initialStack={stack}>
        <Section title="Pages">
          {leftNav.pages.map((page) => (
            <NavigationLinkItem key={page.id} item={page} />
          ))}
        </Section>
      </NestableNavigationContent>
    </SideNavigation>
  );
};

const NavigationLinkItem = ({ item }: { item: NavigationItem }) => {
  return (
    <LinkItem iconBefore={<ContentIcon identifier={item} />} href={item.href}>
      {item.title}
    </LinkItem>
  );
};

export { SiteLeftNavigation };

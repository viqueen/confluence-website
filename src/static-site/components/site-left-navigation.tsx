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
import React, { useEffect, useState } from "react";

import LibraryIcon from "@atlaskit/icon/core/library";
import StoryIcon from "@atlaskit/icon/core/story";
import {
  Header,
  LinkItem,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
} from "@atlaskit/side-navigation";
import axios from "axios";

import { titleToPath } from "../../common/helpers";
import { LeftNavigation, NavigationItem } from "../../confluence-extract";

import { ContentIcon } from "./helpers";
import { siteProperties } from "./site-properties";

const SiteLeftNavigation = () => {
  const [leftNav, setLeftNav] = useState<LeftNavigation | undefined>(undefined);
  const [stack, setStack] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<LeftNavigation>("/left-navigation.json");
      return data;
    };
    fetchData()
      .then((data) => {
        setLeftNav(data);
        const pathName = window.location.pathname;
        const resolved = data.paths[pathName];
        setStack(resolved ? [resolved] : []);
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
      <NestableNav
        stack={stack}
        pages={leftNav?.pages}
        blogs={leftNav?.blogs}
      />
    </SideNavigation>
  );
};

const NestableNav = ({
  stack,
  pages,
  blogs,
}: {
  stack?: string[];
  pages?: NavigationItem[];
  blogs?: Record<number, NavigationItem[]>;
}) => {
  if (!stack) {
    return null;
  }
  return (
    <NestableNavigationContent initialStack={stack}>
      <Section title="Pages">
        {pages?.map((page) => (
          <PageNavigation page={page} key={page.id} />
        ))}
      </Section>
      <Section title={"Blogs"} hasSeparator={true}>
        {Object.entries(blogs || {})
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([year, items]) => (
            <BlogYearNavigation
              year={parseInt(year)}
              items={items}
              key={year}
            />
          ))}
      </Section>
    </NestableNavigationContent>
  );
};

const PageNavigation = ({ page }: { page: NavigationItem }) => {
  const children = page.children || [];
  if (children.length > 0) {
    return (
      <NestingItem
        id={`/pages/${titleToPath(page.title)}/`}
        title={page.title}
        iconBefore={<ContentIcon identifier={page} />}
        onClick={() => window.location.assign(page.href)}
      >
        {page.children?.map((child) => (
          <PageNavigation page={child} key={child.id} />
        ))}
      </NestingItem>
    );
  }
  return <NavigationLinkItem item={page} />;
};

const BlogYearNavigation = ({
  year,
  items,
}: {
  year: number;
  items: NavigationItem[];
}) => {
  return (
    <NestingItem
      id={`/blogs/${year}/`}
      title={`${year}`}
      iconBefore={<StoryIcon label={`${year}`} />}
    >
      {items.map((item) => (
        <NavigationLinkItem item={item} key={item.id} />
      ))}
    </NestingItem>
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

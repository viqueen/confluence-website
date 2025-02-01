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

import Spinner from "@atlaskit/spinner";
import axios from "axios";

import { titleToPath } from "../../../../../common/helpers";
import {
  ContentData,
  ContentIdentifier,
} from "../../../../../confluence-extract";

import "./children-macro.css";

const ChildrenMacro = ({
  content,
  parent,
}: {
  content: ContentData;
  parent?: string;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [childPages, setChildPages] = useState<Array<ContentIdentifier>>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (parent) {
        setLoading(true);
        const { data } = await axios.get(
          `/pages/${titleToPath(parent)}/data.json`,
        );
        return { childPages: data.childPages };
      } else {
        return { childPages: content.childPages };
      }
    };
    fetchData()
      .then((data) => {
        setChildPages(data.childPages);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {loading && <Spinner size="small" />}
      {!loading && childPages && (
        <div className="children-macro">
          {childPages.map((childPage) => (
            <ChildrenMacroItem key={childPage.id} childPage={childPage} />
          ))}
        </div>
      )}
    </>
  );
};

const ChildrenMacroItem = ({ childPage }: { childPage: ContentIdentifier }) => {
  const href = `/pages/${titleToPath(childPage.title)}/`;
  return (
    <div className="children-macro-item">
      <ChildrenMacroItemCover childPage={childPage} />
      <div className="children-macro-item-content">
        <a href={href}>{childPage.title}</a>
      </div>
    </div>
  );
};

const ChildrenMacroItemCover = ({
  childPage,
}: {
  childPage: ContentIdentifier;
}) => {
  if (!childPage.coverUrl) {
    return <div className="children-macro-item-default-cover" />;
  }
  return (
    <img
      alt={`its-a-cover-up`}
      src={`${childPage.coverUrl}&h=500`}
      className="children-macro-item-cover"
    />
  );
};

export { ChildrenMacro };

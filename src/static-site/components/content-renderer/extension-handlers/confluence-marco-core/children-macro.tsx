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

import Spinner from "@atlaskit/spinner";
import axios from "axios";

import { titleToPath } from "../../../../../common/helpers";
import { ContentData } from "../../../../../confluence-extract";

import { MacroError } from "./macro-error";

import "./children-macro.css";

const ChildrenMacro = ({
  content,
  parent,
}: {
  content: ContentData;
  parent?: string;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [childPages, setChildPages] = useState<
    Array<{ id: number; title: string }> | undefined
  >(undefined);

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
      {!loading && !childPages && <MacroError />}
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

const ChildrenMacroItem = ({
  childPage,
}: {
  childPage: { id: number; title: string };
}) => {
  const href = `/pages/${titleToPath(childPage.title)}/`;
  return (
    <div className="children-macro-item">
      <a href={href}>{childPage.title}</a>
    </div>
  );
};

export { ChildrenMacro };

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

import "./site-content.css";
import Spinner from "@atlaskit/spinner";
import axios from "axios";

import { ContentData } from "../../confluence-extract";

import { ContentError, ContentLayout } from "./content";
import { siteProperties } from "./site-properties";

const SiteContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<ContentData | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await axios.get<ContentData>("data.json");
      return data;
    };
    fetchData()
      .then((data) => {
        document.title = `${siteProperties.name} - ${data.identifier.title}`;
        setContent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="site-content">
      {loading && <Spinner size="large" />}
      {!loading && !content && <ContentError />}
      {!loading && content && <ContentLayout content={content} />}
    </div>
  );
};

export { SiteContent };

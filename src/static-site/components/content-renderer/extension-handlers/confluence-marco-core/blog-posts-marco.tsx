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

import Avatar from "@atlaskit/avatar";
import { Date } from "@atlaskit/date";
import Spinner from "@atlaskit/spinner";
import { colorPalette } from "@atlaskit/theme/color-palettes";
import axios from "axios";

import { unescapeExcerpt } from "../../../../../common/helpers";
import { BlogPostSummary } from "../../../../../confluence-extract";

import "./blog-posts-macro.css";

const BlogPostsMarco = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await axios.get("blogs.json");
      return data;
    };
    fetchData()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {loading && <Spinner />}
      {!loading && (
        <div className={"blog-posts"}>
          {posts.map((post) => (
            <BlogPostItem post={post} key={post.identifier.id} />
          ))}
        </div>
      )}
    </div>
  );
};

const BlogPostItem = ({ post }: { post: BlogPostSummary }) => {
  return (
    <div className="blog-post-item">
      <BlogPostItemCover post={post} />
      <div className={"blog-post-item-content"}>
        <a href={post.href}>{post.identifier.title}</a>
        <div className="excerpt">{unescapeExcerpt(post.excerpt)}</div>
        <div className="by-line">
          <Avatar
            appearance="circle"
            src={`/assets/avatars/${post.author.id}-avatar`}
          />
          <div
            style={{
              color: colorPalette("24")[16].background,
              display: "inline-block",
              marginLeft: 5,
            }}
          >
            <div>by {post.author.title}</div>
            <div style={{ display: "inline-block" }}>
              on{" "}
              <Date value={post.createdDate} color="blue" format="MMMM do y" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogPostItemCover = ({ post }: { post: BlogPostSummary }) => {
  if (!post.identifier.coverUrl) {
    return <div className="blog-post-item-default-cover"></div>;
  }
  return (
    <img
      alt={`its-a-cover-up`}
      src={`${post.identifier.coverUrl}&h=500`}
      className={"blog-post-item-cover"}
    />
  );
};

export { BlogPostsMarco };

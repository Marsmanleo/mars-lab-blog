"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../utils/fetch-api";

import Loader from "../components/Loader";
import Blog from "../views/blog-list";
import PageHeader from "../components/PageHeader";

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

export default function Profile() {
  const [meta, setMeta] = useState<Meta | undefined>();
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = "5b8904ecb951a3c10e2c98f82c3d2f74f9a8e42d3ba107a4eba310eacfae125d7b2ed3f539986bd04b64b0e5fbfa3785c516b6667e05e4f18fbd7fcb93371679138375c20b01bbabd6eb64ea63714c4a5917cdc24ad9c26d95776f88ddb2b60cf6055886e8b396a638480f032e3b0e27dc4423cf674e07a974b41a85b84cbf39";
      const path = "/articles";
      const urlParamsObject = {
        sort: { createdAt: "desc" },
        populate: {
          cover: { fields: ["url"] },
          category: { populate: "*" },
          authorsBio: {
            populate: "*",
          },
        },
        pagination: {
          start: start,
          limit: limit,
        },
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData = await fetchAPI(path, urlParamsObject, options);

      if (start === 0) {
        setData(responseData.data);
      } else {
        setData((prevData: any[]) => [...prevData, ...responseData.data]);
      }

      setMeta(responseData.meta);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  function loadMorePosts(): void {
    if (meta && meta.pagination) {
      const nextPosts = meta.pagination.start + meta.pagination.limit;
      fetchData(nextPosts, 10);
    }
  }

  useEffect(() => {
    fetchData(0, 10);
  }, [fetchData]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div>
      <PageHeader heading="Our Blog" text="Checkout Something Cool" />
      <Blog data={data}>
        {meta && meta.pagination && 
          meta.pagination.start + meta.pagination.limit < meta.pagination.total && (
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-3 text-sm rounded-lg hover:underline dark:bg-gray-900 dark:text-gray-400"
              onClick={loadMorePosts}
            >
              Load more posts...
            </button>
          </div>
        )}
      </Blog>
    </div>
  );
}

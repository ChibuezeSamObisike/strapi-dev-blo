/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import Link from "next/link";
import { getAllPosts } from "../lib/api";
import { BlogPost } from "@/lib/types";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the search query and page from the URL params
  const searchQuery = searchParams.get("search") ?? "";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1; // Default to page 1 if not present

  useEffect(() => {
    const fetchPosts = async (page: number) => {
      try {
        const { posts, pagination } = await getAllPosts(page, searchQuery);
        setPosts(posts);
        setTotalPages(pagination.pageCount); // Set total pages
      } catch (error) {
        setError("Error fetching posts.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(currentPage);
  }, [currentPage, searchQuery]); // Re-fetch when page or search query changes

  const handlePageChange = (newPage: number) => {
    // Update the page parameter in the URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
    setLoading(true); // Show loader while fetching
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {loading && (
        <div className="w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="cursor-pointer bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link href={`/blogs/${post.slug}`} className="block">
                    {post.cover?.url && (
                      <div className="relative h-36 w-full">
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover.url}`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-semibold font-jet-brains text-white line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 mt-2 text-sm leading-6 line-clamp-3">
                        {post.description}
                      </p>
                      <p className="text-purple-400 text-sm mt-4 inline-block font-medium hover:underline">
                        Read More
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No posts available at the moment.</p>
            )}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange} // Update page when pagination changes
          />
        </>
      )}
    </div>
  );
}

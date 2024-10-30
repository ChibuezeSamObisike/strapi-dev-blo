/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { getPostBySlug } from "../../../lib/api"; // Import your API function
import { useRouter } from "next/navigation";
import { BlogPost } from "@/lib/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaClipboard } from "react-icons/fa"; // Import your chosen icon
import Loader from "@/components/Loader";
import moment from "moment";
import { toast } from "react-hot-toast";


const handleCopyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!"); // Show toast on error
  } catch (err) {
    console.error("Failed to copy code: ", err);
  }
};

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          // Fetch the post using the slug
          const fetchedPost = await getPostBySlug(slug);
          setPost(fetchedPost);
        } catch (err) {
          setError("Error fetching post.");
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [slug]);

  if (loading)
    return (
      <div className="max-w-screen-lg mx-auto flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="max-w-screen-lg mx-auto">Error: {error}</p>;
  if (!post) return <p className="max-w-screen-lg mx-auto">No post found.</p>;
  console.log(post);
  return (
    <>
      {/* <SEO
        title={`${post.title}`}
        descripton={post.description}
        favicon={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover.url}`}
        coverImage={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover.url}`}
      /> */}
      <div className="max-w-screen-md mx-auto p-4">
        <h1 className="text-4xl leading-[60px] capitalize text-center font-bold text-purple-800 font-jet-brains">
          {post.title}
        </h1>
        <div className="w-full flex items-center justify-center font-light">
          Published: {moment(post.createdAt).fromNow()}
        </div>

        {/* Categories Section */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap space-x-2 my-4">
            {post.categories.map(({ name, documentId }) => (
              <span
                key={documentId}
                className="border border-purple-900 font-medium px-2 py-2 text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {post.cover && (
          <div className="relative h-72 w-full my-4">
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover.url}`}
              alt={post.title}
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        )}
        <p className="text-gray-300 leading-[32px] tracking-wide italic mt-2 mb-6">
          {post.description}
        </p>
        <Markdown
          className={"leading-[40px] max-w-screen-lg prose prose-invert"}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              return !inline && match ? (
                <div className="relative">
                  <button
                    onClick={() => handleCopyCode(codeString)}
                    className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded-md hover:bg-gray-600"
                    title="Copy to clipboard"
                  >
                    <FaClipboard color="#fff" />
                  </button>
                  <SyntaxHighlighter
                    style={dracula}
                    PreTag="div"
                    language={match[1]}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </Markdown>
        <button
          onClick={() => router.back()}
          className="text-purple-800 mt-4 inline-block hover:underline"
        >
          Back to Blogs
        </button>
      </div>
    </>
  );
};

export default BlogPostPage;

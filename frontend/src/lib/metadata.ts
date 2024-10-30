import { Metadata } from "next";
import { getPostBySlug } from "@/lib/api"; // Adjust the path as needed

export const generateSEO = async (params: { slug: string }): Promise<Metadata> => {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Not Found",
      description: "This page is not found.",
    };
  }
  return {
    title: post.title,
    description: post.description,
  };
};

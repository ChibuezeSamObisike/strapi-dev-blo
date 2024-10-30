"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import slugify from "react-slugify";
import MarkdownEditor from "@uiw/react-markdown-editor";
import Image from "next/image";
import { createPost, uploadImage } from "@/lib/api";
import { toast } from "react-hot-toast";

const WritePost = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setCoverImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create slug from the title
      const postSlug = slugify(title);
      // Create the post initially without the image
      const postData = {
        title,
        description,
        slug: postSlug,
        content: markdownContent,
      };

      // Step 1: Create the blog post without the cover image
      const postResponse = await createPost(postData);
      const postId = postResponse.id;
      console.log(postId);

      // Step 2: Upload cover image (if provided) and associate with blog post
      if (coverImage) {
        const uploadedImage = await uploadImage(coverImage, postId);
        console.log("Image uploaded:", uploadedImage);
      }

      // Redirect after successful post creation
      router.push(`/blogs/${postSlug}`);
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Failed to create post:", error);
      setError("Failed to create post. Please try again.");
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="text-purple-400 hover:text-purple-500 mb-6 flex items-center space-x-2"
      >
        <FaArrowLeft /> <span>Back</span>
      </button>

      <h1 className="text-xl font-bold mb-4 text-gray-100 font-jet-brains">
        Create New Post
      </h1>
      {/* Render a message if there is an error */}
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-md">{error}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter a Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 font-jet-brains text-3xl font-semibold bg-[#161b22] text-gray-100 border-b border-gray-600 focus:border-purple-500 focus:outline-none placeholder-gray-400"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 font-jet-brains bg-[#161b22] font-semibold text-gray-100 border-b border-gray-600 focus:border-purple-500 focus:outline-none placeholder-gray-400"
        />
      </div>
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full bg-[#161b22] text-gray-100"
        />
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Selected Cover"
              width="100"
              height="100"
              className="w-full h-auto rounded-md"
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <MarkdownEditor
          value={markdownContent}
          height="200px"
          onChange={(value) => setMarkdownContent(value)}
          className="bg-[#161b22] text-gray-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || (!title && !description)}
        className="bg-purple-600 text-gray-100 py-2 px-4 rounded-md hover:bg-purple-500"
      >
        {isLoading ? "Loading" : "Post"}
      </button>
    </div>
  );
};

export default WritePost;

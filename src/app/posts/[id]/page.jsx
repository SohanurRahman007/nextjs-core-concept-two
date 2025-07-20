import React from "react";

export const getSinglePost = async (post_id) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${post_id}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
};

export async function generateMetadata({ params }) {
  // read route params
  const id = (await params).id;

  // fetch data
  const singlePost = await getSinglePost(id);

  return {
    title: singlePost.title,
    description: singlePost.body,
  };
}

export default async function SinglePost({ params }) {
  const { id } = params;

  const singlePost = await getSinglePost(id);

  // Optional: Handle case where post is not found (e.g., 404 from API)
  if (!singlePost || Object.keys(singlePost).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50 p-6 rounded-lg shadow-md">
        <p className="text-xl text-gray-700 font-medium">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl bg-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
        {singlePost.title}
      </h1>
      <hr className="border-t-2 border-blue-500 mb-6 w-1/4" />{" "}
      {/* Decorative separator */}
      <p className="text-lg text-gray-800 leading-relaxed">{singlePost.body}</p>
      {/* Optional: Add a back button or metadata */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>Post ID: {singlePost.id}</p>
        {/* You could add more metadata here, e.g., author if available */}
      </div>
    </div>
  );
}

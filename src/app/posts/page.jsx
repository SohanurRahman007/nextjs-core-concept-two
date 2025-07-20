import Link from "next/link";
import React from "react";
import style from "./post.module.css";

export const getPost = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();
  return data;
};

export const metadata = {
  title: " All Posts | Learning NextJS",
  description: "Loading JSON jsonPlace post using server component",
};

export default async function Posts() {
  const posts = await getPost();
  return (
    // THIS IS THE KEY CHANGE:
    // Apply `grid` and `grid-cols-X` (and `gap-X` for spacing) to the outer container
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
      {posts.map((singlePost) => (
        // Each `singlePost` div is now a direct child of the grid container,
        // so it will automatically be placed into the grid columns.
        <div key={singlePost.id} className="border p-4 rounded-lg shadow-md ">
          <h2 className={`text-xl font-semibold mb-2 ${style["test-bg"]}`}>
            {singlePost.title}
          </h2>
          <p className="text-gray-700 testing-purpose-css-class">
            {singlePost.body}
          </p>
          <Link href={`/posts/${singlePost.id}`}>Details</Link>
        </div>
      ))}
    </div>
  );
}

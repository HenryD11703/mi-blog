"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Post = {
  id: string;
  title: string;
  author: string | null;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get("/api/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Mi Blog</h1>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "1rem" }}>
          <Link href={`/posts/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>por {post.author ?? "Anónimo"} - {new Date(post.created_at).toLocaleString()}</p>
        </div>
      ))}
    </main>
  );
}

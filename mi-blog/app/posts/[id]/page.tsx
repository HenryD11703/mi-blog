"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
};

export default function PostPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`).then((res) => setPost(res.data));
    }
  }, [id]);

  if (!post) return <p>Cargando...</p>;

  async function handleDelete() {
    if (confirm("¿Seguro que quieres borrar este post?")) {
      try {
        await axios.delete(`/api/posts/${id}`);
        router.push("/");
      } catch (err) {
        console.error(err);
        alert("Error borrando post");
      }
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p>
        por {post.author} - {new Date(post.created_at).toLocaleString()}
      </p>

      <article style={{ marginTop: "2rem" }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
      </article>

      {session?.user?.name === post.author && (
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <button onClick={() => router.push(`/posts/${id}/edit`)}>Editar</button>
          <button onClick={handleDelete}>Borrar</button>
        </div>
      )}
    </main>
  );
}

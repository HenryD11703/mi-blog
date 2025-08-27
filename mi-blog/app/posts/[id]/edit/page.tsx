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
};

export default function EditPostPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Cargar post
  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`).then((res) => {
        setPost(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [id]);

  // Si no está logueado → redirigir
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (!post) return <p>Cargando...</p>;

  // Solo el autor puede editar
  if (session?.user?.name !== post.author) {
    return <p>No tienes permisos para editar este post.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return alert("Completa todos los campos");

    try {
      await axios.put(`/api/posts/${id}`, { title, content });
      router.push(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error editando post");
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Editar Post</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ padding: "0.5rem", fontFamily: "monospace" }}
        />
        <button type="submit">Guardar cambios</button>
      </form>

      <h2>Vista previa</h2>
      <article style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
      </article>
    </main>
  );
}

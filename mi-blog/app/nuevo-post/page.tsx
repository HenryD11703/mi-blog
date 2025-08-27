"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function NuevoPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Redirigir si no hay sesión
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <p>Cargando...</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return alert("Completa todos los campos");

    try {
      await axios.post("/api/posts", {
        title,
        content,
        author: session?.user?.name || "Anónimo",
      });

      router.push("/"); // volver al home
    } catch (err) {
      console.error(err);
      alert("Error creando post");
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Nuevo Post</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <textarea
          placeholder="Escribe en Markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ padding: "0.5rem", fontSize: "1rem", fontFamily: "monospace" }}
        />
        <button type="submit">Publicar</button>
      </form>

      <h2>Vista previa</h2>
      <article style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content || "*Escribe algo en Markdown para previsualizar*"}</ReactMarkdown>
      </article>
    </main>
  );
}

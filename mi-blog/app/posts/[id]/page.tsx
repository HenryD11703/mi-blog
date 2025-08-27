"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Calendar, User, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`)
        .then((res) => {
          setPost(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  async function handleDelete() {
    if (confirm("¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`/api/posts/${id}`);
        router.push("/");
      } catch (err) {
        console.error(err);
        alert("Error eliminando el post");
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6 w-1/4"></div>
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post no encontrado</h1>
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </main>
    );
  }

  const isAuthor = session?.user?.name === post.author;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación */}
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al blog</span>
          </Link>
        </nav>

        {/* Artículo */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <header className="px-8 py-8 border-b border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>{new Date(post.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              {/* Acciones del autor */}
              {isAuthor && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push(`/posts/${id}/edit`)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Contenido */}
          <div className="px-8 py-8">
            <div className="prose prose-lg prose-blue max-w-none markdown-content">
              <ReactMarkdown 
                rehypePlugins={[rehypeSanitize]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <footer className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                ¿Te gustó este artículo? ¡Compártelo con tus amigos!
              </p>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-blue-600 transition-colors">
                  Compartir
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>

      {/* CSS personalizado para el markdown */}
      <style jsx global>{`
        .markdown-content h1 {
          @apply text-3xl font-bold text-gray-900 mt-8 mb-4;
        }
        .markdown-content h2 {
          @apply text-2xl font-bold text-gray-900 mt-6 mb-3;
        }
        .markdown-content h3 {
          @apply text-xl font-bold text-gray-900 mt-4 mb-2;
        }
        .markdown-content p {
          @apply text-gray-700 leading-relaxed mb-4;
        }
        .markdown-content ul {
          @apply list-disc list-inside mb-4 text-gray-700;
        }
        .markdown-content ol {
          @apply list-decimal list-inside mb-4 text-gray-700;
        }
        .markdown-content li {
          @apply mb-1;
        }
        .markdown-content blockquote {
          @apply border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-blue-50 p-4 rounded-r-lg mb-4;
        }
        .markdown-content code {
          @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800;
        }
        .markdown-content pre {
          @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
        }
        .markdown-content pre code {
          @apply bg-transparent p-0;
        }
        .markdown-content a {
          @apply text-blue-600 hover:text-blue-700 underline;
        }
        .markdown-content img {
          @apply rounded-lg shadow-md max-w-full h-auto;
        }
      `}</style>
    </main>
  );
}
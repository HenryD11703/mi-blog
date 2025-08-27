"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { ArrowLeft, Eye, EyeOff, Save, FileText } from "lucide-react";
import Link from "next/link";

export default function NuevoPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Por favor, completa tanto el título como el contenido");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/posts", {
        title: title.trim(),
        content: content.trim(),
        author: session?.user?.name || "Anónimo",
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Error creando el post. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Crear Nuevo Post</h1>
          </div>
          <p className="text-gray-600">
            Comparte tus ideas con la comunidad. Puedes usar Markdown para formatear tu contenido.
          </p>
        </header>

        {/* Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título del artículo
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Escribe un título atractivo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contenido */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Contenido (Markdown)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="lg:hidden flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{showPreview ? 'Ocultar' : 'Mostrar'} Vista Previa</span>
                  </button>
                </div>
                <textarea
                  id="content"
                  placeholder="Escribe tu artículo en Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Botones */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Publicar Artículo</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* Vista Previa */}
          <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Eye size={20} />
                <span>Vista Previa</span>
              </h3>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {title || "Título de tu artículo"}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                    <span>por {session?.user?.name || "Tu nombre"}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                      {content || "*Escribe algo en Markdown para ver la vista previa...*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Consejos de Markdown */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Consejos de Markdown</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <code className="bg-blue-100 px-1 rounded"># Título</code> para encabezados</li>
                  <li>• <code className="bg-blue-100 px-1 rounded">**negrita**</code> y <code className="bg-blue-100 px-1 rounded">*cursiva*</code></li>
                  <li>• <code className="bg-blue-100 px-1 rounded">- Item</code> para listas</li>
                  <li>• <code className="bg-blue-100 px-1 rounded">[texto](url)</code> para enlaces</li>
                  <li>• <code className="bg-blue-100 px-1 rounded">`código`</code> para código inline</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS personalizado para el preview */}
      <style jsx global>{`
        .prose h1 { @apply text-2xl font-bold text-gray-900 mt-6 mb-4; }
        .prose h2 { @apply text-xl font-bold text-gray-900 mt-5 mb-3; }
        .prose h3 { @apply text-lg font-bold text-gray-900 mt-4 mb-2; }
        .prose p { @apply text-gray-700 mb-3 leading-relaxed; }
        .prose ul { @apply list-disc list-inside mb-3 text-gray-700; }
        .prose ol { @apply list-decimal list-inside mb-3 text-gray-700; }
        .prose li { @apply mb-1; }
        .prose blockquote { @apply border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-blue-50 p-3 rounded-r mb-3; }
        .prose code { @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800; }
        .prose pre { @apply bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto mb-3; }
        .prose pre code { @apply bg-transparent p-0; }
        .prose a { @apply text-blue-600 hover:text-blue-700 underline; }
      `}</style>
    </main>
  );
}
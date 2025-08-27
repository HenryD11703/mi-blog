"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string | null;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/posts").then((res) => {
      setPosts(res.data);
      setLoading(false);
    });
  }, []);

  // Función para extraer un preview del contenido markdown
  const getPreview = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/[#*`\[\]()]/g, '').trim();
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenido a Mi Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre historias increíbles, tutoriales útiles y reflexiones interesantes 
            escritas por nuestra comunidad de autores.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-gray-600">Artículos Publicados</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <User className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {new Set(posts.map(post => post.author)).size}
            </div>
            <div className="text-gray-600">Autores Activos</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {posts.length > 0 ? new Date(posts[0].created_at).toLocaleDateString('es-ES', { month: 'long' }) : '-'}
            </div>
            <div className="text-gray-600">Último Post</div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Últimos Artículos</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hay posts aún</h3>
              <p className="text-gray-600">¡Sé el primero en compartir tu historia!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <User size={14} />
                      <span>{post.author ?? "Anónimo"}</span>
                      <span>•</span>
                      <Calendar size={14} />
                      <span>{new Date(post.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                    
                    <Link href={`/posts/${post.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {getPreview(post.content)}
                    </p>
                    
                    <Link 
                      href={`/posts/${post.id}`}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:underline"
                    >
                      <span>Leer más</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
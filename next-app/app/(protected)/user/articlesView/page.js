"use client";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";

export default function Articles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!user) return;

      try {
        const articlesRef = collection(db, "articles");
        const userCheck = doc(db, "users", user.uid);
        const q = query(articlesRef, where("user", "==", userCheck));
        const snapshot = await getDocs(q);

        const fetchedArticles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArticles(fetchedArticles);
      } catch (err) {
        setError("Failed to fetch articles. Please try again later.");
        console.error(err);
      }
    };

    fetchArticles();
  }, [user]);

  return (
    <section className="p-6 bg-gray-100 text-gray-900 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md space-y-6">
        <h2 className="text-lg font-medium text-center">Your Articles</h2>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {articles.length === 0 && !error && (
          <p className="text-center text-gray-600">No articles found.</p>
        )}

        <ul className="space-y-4">
          {articles.map((article) => (
            <li
              key={article.id}
              className="p-4 bg-gray-50 border rounded-md shadow-sm"
            >
              <h3 className="font-bold text-lg">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// src/components/NewsList.jsx
import { useEffect, useState } from "react";
import { fetchCryptoNews } from "../utils/fetchNews";

export default function NewsList({ currency = "", limit = 4 }) {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCryptoNews(limit, currency)
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, [limit, currency]);

  if (loading) return <p className="animate-pulse text-[#ff33ff]">A carregar notícias…</p>;
  if (!news.length) return <p className="text-gray-400">Sem notícias disponíveis.</p>;

  return (
    <ul className="space-y-3">
      {news.map((n, i) => (
        <li
          key={i}
          className="bg-[#20002b] rounded-xl px-5 py-3 shadow border border-[#ff33ff22] hover:bg-[#2a003a] transition"
        >
          <a href={n.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1">
            <h3 className="font-bold text-[#ff33ff] hover:underline">{n.title}</h3>
            <span className="text-xs text-gray-400">
              {n.source} · {new Date(n.publishedAt).toLocaleDateString()}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

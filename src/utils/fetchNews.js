// src/utils/fetchNews.js
/**
 * Fetch de notícias gerais da CryptoCompare e filtra por moeda.
 * @param {number} limit — número de artigos a mostrar
 * @param {string} currency — símbolo da moeda, ex: "BTC"
 * @returns {Promise<Array<{title,url,source,publishedAt}>>}
 */
export async function fetchCryptoNews(limit = 4, currency = "") {
    const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao carregar notícias");
    const json = await res.json();
    const all = json.Data;
  
    // Função de filtragem por título, body, tags ou categorias
    const matchesCurrency = n => {
      const txt = [
        n.title,
        n.body,
        Array.isArray(n.tags) ? n.tags.join(" ") : (n.tags || ""),
        Array.isArray(n.categories) ? n.categories.join(" ") : (n.categories || "")
      ].join(" ").toLowerCase();
      return txt.includes(currency.toLowerCase());
    };
  
    // Primeiro tenta filtrar por moeda
    let filtered = currency ? all.filter(matchesCurrency) : [];
    // Se faltar, junta notícias gerais até atingir o limite
    if (filtered.length < limit) {
      const extra = all.filter(n => !filtered.includes(n)).slice(0, limit - filtered.length);
      filtered = [...filtered, ...extra];
    }
  
    return filtered.slice(0, limit).map(n => ({
      title:       n.title,
      url:         n.url,
      source:      n.source,
      publishedAt: n.published_on * 1000
    }));
  }
  
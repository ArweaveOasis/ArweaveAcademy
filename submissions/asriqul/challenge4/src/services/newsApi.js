const BASE_URL = 'https://newsapi.org/v2/everything/';

export const fetchNews = async (query, apiKey) => {
    try {
        const response = await fetch(`${BASE_URL}?q=${query}&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrency news');
        }
        const data = await response.json();
        return data.articles.slice(0, 10); // Return only the first 5 articles
    } catch (err) {
        throw new Error(err.message);
    }
};

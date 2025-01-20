import React, { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsApi';
import NewsList from '../components/NewsList';

const Dashboard = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const loadNews = async () => {
            try {
                const articles = await fetchNews('crypto', apiKey);
                setNews(articles);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [apiKey]);

    return (
        <div>
            <h1>Crypto Dashboard</h1>
            <p>Welcome to the Crypto Dashboard! Navigate to see details about wallets and prices.</p>

            <div style={{ marginTop: '2rem' }}>
                <h2>Latest Crypto News</h2>
                {loading && <p>Loading news...</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && <NewsList news={news} />}
            </div>
        </div>
    );
};

export default Dashboard;

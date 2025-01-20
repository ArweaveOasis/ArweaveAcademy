import React, { useState, useEffect } from 'react';

const Prices = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filteredCryptos, setFilteredCryptos] = useState([]);

    const fetchPrices = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
            );
            if (!response.ok) {
                throw new Error('Failed to fetch cryptocurrency prices');
            }
            const data = await response.json();
            setCryptos(data);
            setFilteredCryptos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    useEffect(() => {
        setFilteredCryptos(
            cryptos.filter(crypto =>
                crypto.name.toLowerCase().includes(search.toLowerCase()) ||
                crypto.symbol.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, cryptos]);

    if (loading) return <p>Loading prices...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Top 10 Cryptocurrencies</h1>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search by name or symbol"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
                />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>#</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Symbol</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Price (USD)</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Market Cap</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCryptos.map((crypto, index) => (
                        <tr key={crypto.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{index + 1}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{crypto.name}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{crypto.symbol.toUpperCase()}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>${crypto.current_price.toLocaleString()}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>${crypto.market_cap.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={fetchPrices}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Refresh Prices
            </button>
        </div>
    );
};

export default Prices;

import React from 'react';

const NewsList = ({ news }) => {
    if (!news.length) {
        return <p>No news available</p>;
    }

    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {news.map((article, index) => (
                <li
                    key={index}
                    style={{
                        marginBottom: '1rem',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '1rem',
                    }}
                >
                    <h3 style={{ margin: 0 }}>{article.title}</h3>
                    <p style={{ margin: 0 }}>{article.description}</p>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007BFF' }}
                    >
                        Read more
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default NewsList;

import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const posterUrl = (movie.poster_path?.startsWith('http') || movie.is_mock)
        ? movie.poster_path
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem('movie-favorites') || '[]');
        setIsFavorite(favs.some(f => f.id === movie.id));
    }, [movie.id]);

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let favs = JSON.parse(localStorage.getItem('movie-favorites') || '[]');
        if (isFavorite) {
            favs = favs.filter(f => f.id !== movie.id);
        } else {
            favs.push(movie);
        }
        localStorage.setItem('movie-favorites', JSON.stringify(favs));
        setIsFavorite(!isFavorite);
    };

    return (
        <Card as={Link} to={`/movie/${movie.id}`} className="h-100 shadow-sm border-0 movie-card-hover text-decoration-none text-dark">
            <div className="position-relative">
                <Card.Img variant="top" src={movie.poster_path ? posterUrl : 'https://via.placeholder.com/500x750?text=No+Poster'} />
                <Button
                    variant={isFavorite ? "danger" : "outline-light"}
                    className="position-absolute border-0 rounded-circle p-2 shadow-sm"
                    style={{ top: '10px', right: '10px', background: isFavorite ? undefined : 'rgba(0,0,0,0.3)' }}
                    onClick={toggleFavorite}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </Button>
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 fw-bold text-truncate mb-1">{movie.title}</Card.Title>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="text-muted small">{movie.release_date?.split('-')[0]}</span>
                    <span className="text-warning fw-bold small">⭐ {movie.vote_average?.toFixed(1)}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;

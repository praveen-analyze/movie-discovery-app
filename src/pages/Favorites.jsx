import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('movie-favorites') || '[]');
        setFavorites(saved);
    }, []);

    if (favorites.length === 0) {
        return (
            <Container className="py-5 text-center">
                <h1 className="mb-4 fw-bold">Your Favorites</h1>
                <Alert variant="info" className="p-5 border-0 shadow-sm rounded-4">
                    <h4 className="mb-3 text-dark">You haven't added any favorites yet.</h4>
                    <p className="mb-0 text-muted">Go explore movies and click "Add to Favorites" to keep them here!</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="mb-5 fw-bold">Your Favorites</h1>
            <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                {favorites.map((movie) => (
                    <Col key={movie.id}>
                        <MovieCard movie={movie} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Favorites;

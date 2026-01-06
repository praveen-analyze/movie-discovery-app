import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { getMovieDetails, getMovieCredits } from '../services/api';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const [details, credits] = await Promise.all([
                getMovieDetails(id),
                getMovieCredits(id)
            ]);
            setMovie(details);
            setCast(credits);

            // Re-check favorite status
            const favs = JSON.parse(localStorage.getItem('movie-favorites') || '[]');
            setIsFavorite(favs.some(f => f.id === details.id));

            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    const toggleFavorite = () => {
        if (!movie) return;
        let favs = JSON.parse(localStorage.getItem('movie-favorites') || '[]');
        let newFavs;
        if (isFavorite) {
            newFavs = favs.filter(f => f.id !== movie.id);
        } else {
            newFavs = [...favs, movie];
        }
        localStorage.setItem('movie-favorites', JSON.stringify(newFavs));
        setIsFavorite(!isFavorite);
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!movie) {
        return (
            <Container className="text-center py-5">
                <h3>Movie not found</h3>
                <Button as={Link} to="/" variant="primary">Back to Home</Button>
            </Container>
        );
    }

    const isOMDB = movie.is_omdb;
    const isMock = movie.is_mock;
    const backdropUrl = (movie.backdrop_path || isOMDB)
        ? (isOMDB ? movie.poster_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80";

    const posterUrl = (movie.poster_path?.startsWith('http') || isMock)
        ? movie.poster_path
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    return (
        <div className="movie-details-page">
            <div
                className="hero-section text-white py-5 mb-4"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '400px',
                    width: '100%'
                }}
            >
                <Container>
                    <Row className="align-items-center">
                        <Col md={4} className="mb-4 mb-md-0">
                            <img src={posterUrl} alt={movie.title} className="img-fluid rounded shadow-lg" />
                        </Col>
                        <Col md={8}>
                            <h1 className="display-4 fw-bold mb-2">{movie.title}</h1>
                            <p className="lead mb-4 italic text-secondary">"{movie.tagline}"</p>
                            <div className="mb-4">
                                {movie.genres?.map(g => (
                                    <Badge key={g.id} bg="primary" className="me-2 px-3 py-2 rounded-pill">{g.name}</Badge>
                                ))}
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <div className="fs-3 fw-bold text-warning me-2">⭐ {movie.vote_average?.toFixed(1)}</div>
                                <div className="text-secondary">| {movie.runtime} min | {movie.release_date}</div>
                            </div>
                            <h4 className="mb-3">Overview</h4>
                            <p className="fs-5">{movie.overview}</p>
                            <Button
                                variant={isFavorite ? "danger" : "primary"}
                                size="lg"
                                className="mt-3 px-5 py-3 rounded-pill fw-bold shadow-sm"
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? '❤️ Remove from Favorites' : '💖 Add to Favorites'}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="py-5">
                <h3 className="mb-4 fw-bold">Top Cast</h3>
                <Row xs={2} sm={3} md={5} className="g-4">
                    {cast.map(actor => (
                        <Col key={actor.id} className="text-center">
                            <img
                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Photo'}
                                alt={actor.name}
                                className="img-fluid rounded-circle mb-2 shadow-sm"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            <div className="fw-bold">{actor.name}</div>
                            <div className="small text-muted">{actor.character}</div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default MovieDetails;

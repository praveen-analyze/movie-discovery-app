import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Badge, Alert, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre } from '../services/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMock, setIsMock] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchGenres = async () => {
            const data = await getGenres();
            setGenres(data.genres || []);
            setIsMock(data.is_mock);
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let data;
                if (searchQuery) {
                    data = await searchMovies(searchQuery);
                    setSelectedGenre(null);
                } else if (selectedGenre) {
                    const genreName = genres.find(g => g.id === selectedGenre)?.name || "";
                    data = await getMoviesByGenre(genreName);
                } else {
                    data = await getPopularMovies();
                }

                // Aligning with user snippet's direct results mapping
                setMovies(data.results || []);
                setIsMock(data.is_mock);
            } catch (err) {
                console.error("Failed to fetch movies:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [searchQuery, selectedGenre]);

    return (
        <div className="home-page overflow-hidden">
            {!searchQuery && (
                <div className="bg-dark-promo text-white py-5 mb-5 shadow-sm text-center">
                    <Container className="py-4">
                        <h1 className="display-3 fw-bold mb-3">Welcome to Movie<span className="text-primary">Pulse</span></h1>
                        <p className="lead text-secondary fs-4">Your ultimate destination to discover trending stories.</p>
                    </Container>
                </div>
            )}

            <Container className="pb-5">
                {!searchQuery && (
                    <div className="mb-4 d-flex flex-wrap justify-content-center gap-2 bg-white p-3 rounded shadow-sm">
                        <Badge
                            bg={!selectedGenre ? "primary" : "light"}
                            text={!selectedGenre ? "white" : "dark"}
                            className="me-2 px-3 py-2 cursor-pointer rounded-pill"
                            onClick={() => setSelectedGenre(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            All
                        </Badge>
                        {genres.map(g => (
                            <Badge
                                key={g.id}
                                bg={selectedGenre === g.id ? "primary" : "light"}
                                text={selectedGenre === g.id ? "white" : "dark"}
                                className="me-2 px-3 py-2 cursor-pointer rounded-pill"
                                onClick={() => setSelectedGenre(g.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {g.name}
                            </Badge>
                        ))}
                    </div>
                )}

                {isMock && (
                    <Alert variant="info" className="mb-4 border-0 shadow-sm rounded-4 text-center py-4">
                        <div className="d-flex flex-column align-items-center">
                            <div className="fs-5 mb-2">🚀 <strong>Preview Mode Active</strong></div>
                            <p className="mb-3 text-muted">You're currently exploring our hand-picked library. To unlock <strong>every movie in the world</strong>, connect your live API key.</p>
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-pill px-4"
                                    href="https://www.themoviedb.org/settings/api"
                                    target="_blank"
                                >
                                    Get Your Free API Key
                                </Button>
                                <div className="bg-light p-2 rounded border small text-break">
                                    <code>VITE_TMDB_API_KEY=your_key_here</code>
                                </div>
                            </div>
                        </div>
                    </Alert>
                )}

                <h2 className="mb-4 fw-bold text-center text-lg-start">
                    {searchQuery ? `Search results for "${searchQuery}"` : selectedGenre ? `Discovery: ${genres.find(g => g.id === selectedGenre)?.name}` : 'Trending Today'}
                </h2>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" size="xl" />
                    </div>
                ) : (
                    <>
                        {movies.length === 0 ? (
                            <div className="text-center py-5">
                                <h3>No movies found. Try another search!</h3>
                            </div>
                        ) : (
                            <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4 justify-content-center">
                                {movies.map((movie) => (
                                    <Col key={movie.id}>
                                        <MovieCard movie={movie} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};

export default Home;

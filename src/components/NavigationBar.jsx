import React from 'react';
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow py-2 py-lg-3 main-nav">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary me-auto me-lg-4">
                    Movie<span className="text-white">Pulse</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="movie-navbar-collapse" className="border-0 shadow-none ms-2" />

                <Navbar.Collapse id="movie-navbar-collapse">
                    <Nav className="me-auto my-2 my-lg-0">
                        <Nav.Link as={NavLink} to="/" end className="px-lg-3">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/favorites" className="px-lg-3">Favorites</Nav.Link>
                    </Nav>

                    <Form className="d-flex mt-3 mt-lg-0 nav-search-form" onSubmit={(e) => {
                        e.preventDefault();
                        const query = e.target.search.value;
                        if (query) navigate(`/?search=${encodeURIComponent(query)}`);
                        // Collapse navbar if open
                        const toggler = document.querySelector('.navbar-toggler');
                        if (toggler && !toggler.classList.contains('collapsed')) toggler.click();
                    }}>
                        <div className="input-group">
                            <Form.Control
                                type="search"
                                placeholder="Search..."
                                className="bg-transparent text-white border-secondary"
                                aria-label="Search"
                                name="search"
                            />
                            <Button variant="primary" type="submit" className="px-3">
                                🔍
                            </Button>
                        </div>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Favorites from './pages/Favorites'
import './App.css'

function App() {
    return (
        <Router>
            <div className="App bg-light min-vh-100">
                <NavigationBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App

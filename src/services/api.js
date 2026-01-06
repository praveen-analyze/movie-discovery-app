const API_KEY = "43e0be8d";
const BASE_URL = "https://www.omdbapi.com/";

/**
 * Mapping OMDB Movie object to application's internal model
 */
const mapOMDBMovie = (movie) => ({
    id: movie.imdbID,
    title: movie.Title,
    poster_path: movie.Poster !== "N/A" ? movie.Poster : null,
    release_date: movie.Year,
    vote_average: movie.imdbRating ? parseFloat(movie.imdbRating) : 0,
    is_omdb: true,
    overview: movie.Plot || "No description available.",
    genres: movie.Genre ? movie.Genre.split(',').map((g, i) => ({ id: i, name: g.trim() })) : [],
    runtime: movie.Runtime ? parseInt(movie.Runtime.split(' ')[0]) : 0,
    tagline: movie.Awards || ""
});

export const getPopularMovies = async () => {
    try {
        // Since OMDB doesn't have a "Popular" list, we'll default to a search for "Marvel" or "2024"
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=marvel&type=movie`);
        const data = await response.json();
        const results = (data.Search || []).map(mapOMDBMovie);
        return { results, is_mock: false };
    } catch (error) {
        console.error("Popular Fetch Error:", error);
        return { results: [], is_mock: false };
    }
};

export const searchMovies = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
        const data = await response.json();
        const results = (data.Search || []).map(mapOMDBMovie);
        return { results, is_mock: false };
    } catch (error) {
        console.error("Search Error:", error);
        return { results: [], is_mock: false };
    }
};

export const getMovieDetails = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
        const data = await response.json();
        return mapOMDBMovie(data);
    } catch (error) {
        console.error("Detail Error:", error);
        return null;
    }
};

export const getMovieCredits = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
        const data = await response.json();
        // OMDB provides Actors as a string, we'll map them to a cast-like array
        return data.Actors ? data.Actors.split(',').map((name, i) => ({
            id: i,
            name: name.trim(),
            character: "Cast Member",
            profile_path: null
        })) : [];
    } catch (error) {
        console.error("Credits Error:", error);
        return [];
    }
};

export const getGenres = async () => {
    // OMDB doesn't have a genre list, providing a custom one for compatibility
    return {
        genres: [
            { id: 1, name: "Action" },
            { id: 2, name: "Comedy" },
            { id: 3, name: "Drama" },
            { id: 4, name: "Sci-Fi" },
            { id: 5, name: "Horror" }
        ],
        is_mock: true
    };
};

export const getMoviesByGenre = async (genreName) => {
    // OMDB doesn't support genre filtering via ID, so we search by terms like "Action"
    return await searchMovies(genreName);
};
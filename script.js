const API_KEY = '3a142b16f7c1c0755b10c0d7cf55577c'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const GENRE_URL = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;

const endpoints = {
    popular: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=' + API_KEY,
    topRated: `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${API_KEY}`,
    upcoming: `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=${API_KEY}`
};

const sections = {
    popular: document.querySelector('#popular-movies .movie-container'),
    topRated: document.querySelector('#top-rated-movies .movie-container'),
    upcoming: document.querySelector('#upcoming-movies .movie-container')
};

let genres = {};

async function fetchGenres() {
    try {
        const response = await fetch(GENRE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        genres = data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
        }, {});
        fetchAllMovies();
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

async function fetchAllMovies() {
    try {
        await fetchMovies(endpoints.popular, sections.popular);
        await fetchMovies(endpoints.topRated, sections.topRated);
        await fetchMovies(endpoints.upcoming, sections.upcoming);
    } catch (error) {
        console.error('Error fetching all movies:', error);
    }
}

async function fetchMovies(url, section) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        displayMovies(data.results, section);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies, section) {
    section.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const movieGenres = movie.genre_ids.map(id => genres[id]).join(', ');

        movieElement.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <span><b>${movie.release_date.split('-')[0]}</b></span>
            </div>
            <div class="description">
                <h5>Description:</h5>
                <p>${movie.overview}</p>
                <span id="movie-genre"><b>Genre</b>: ${movieGenres}</span>
            </div>
        `;
        
        section.appendChild(movieElement);
    });
}

fetchGenres();

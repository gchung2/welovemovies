const db = require("../db/connection");
const moviesServices = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function listMovies(request, response, next) {
    const is_showing = request.query.is_showing;
    if (is_showing == "true") {
        const movies = await moviesServices.listActiveMovies();
        response.json({ data: movies });
    } else {
        const movies = await moviesServices.listMovies();
        response.json({ data: movies });
    };
}

async function movieExists(request, response, next) {
    const movieId = request.params.movieId;
    const movie = await moviesServices.readMovie(movieId);
    if (movie[0]) {
        return next();
    };
    next({
        status:404,
        message: `Movie ${movieId} cannot be found`
    });
}

async function readMovie(request, response, next) {
    const { movieId } = request.params;
    const movie = await moviesServices.readMovie(movieId);
    response.json({ data: movie[0] });
}

module.exports = {
    list: [listMovies],
    read: [movieExists, asyncErrorBoundary(readMovie)],
}
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const movieService = require('./movies.service');

async function movieExists(req, res, next){
  const movieId = Number(req.params.movieId);
  const foundMovie = await movieService.searchMovies(movieId);
  if (foundMovie){
    res.locals.movie = foundMovie;
    next();
  } else next({status:404, message:"Movie cannot be found."});
}
async function isQuery(req, res, next){ // ensures the route request goes to the correct function
  if(req.query.is_showing==="true")
    next();
  else if(req.originalUrl === '/movies') list(req, res);
  else next({status:404, message:"No showings were found."}); 
}

async function listShowings(req, res, next){
  res.json({data: await movieService.listShowings() })
}

async function listTheaters(req, res, next){
  const movieId = res.locals.movie.movie_id;
  res.json({data: await movieService.findTheatersForMovie(movieId)})
}

async function listReviews(req, res, next){
  const movieId = res.locals.movie.movie_id;
  res.json({data: await movieService.addCriticToReviews(movieId)})
}

async function list(req, res){
   res.json({data: await movieService.list() })
}
async function read(req, res){
  res.json({data: res.locals.movie});
}

module.exports={
  listShowings:[isQuery, asyncErrorBoundary(listShowings)],
  listTheaters: [movieExists, asyncErrorBoundary(listTheaters)],
  listReviews: [movieExists, asyncErrorBoundary(listReviews)],
  read: [movieExists, asyncErrorBoundary(read)],
  list: asyncErrorBoundary(list)
}
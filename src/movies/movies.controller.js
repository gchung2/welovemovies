const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await service.read(movieId);
    if (movie) {
      res.locals.movie = movie;
      return next();
    }
    next({
      status: 404,
      message: "Movie cannot be found."
    });
  }

  async function list(req, res) {
    const { is_showing } = req.query;
    if (is_showing) {
      res.json({ data: await service.listIsShowings() })
    } else {
        res.json({ data: await service.list() })
    }
}
  
async function read(req, res, next) {
  const movie = res.locals.movie;
  res.json({data: movie});
}
  
  async function readTheaters(req, res, next) {
    const { movieId } = req.params;
    const data = await service.readTheaters(movieId);
    res.json({ data });
  }
  
  async function readReviews(req, res) {
    const { movieId } = req.params;
    const data = await service.readReviews(movieId);
    res.json({ data });
  }
  
  module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    readTheaters: [
      asyncErrorBoundary(movieExists),
      asyncErrorBoundary(readTheaters)
    ],
    readReviews: [
      asyncErrorBoundary(movieExists),
      asyncErrorBoundary(readReviews)
    ],
  };
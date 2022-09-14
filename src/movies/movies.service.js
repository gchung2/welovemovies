const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCriticDetails = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list() {
  return knex("movies").select("*").groupBy('movies.movie_id');
}

function listIsShowing() {
  return knex("movies")
  .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
  .select("movies.*")
  .where( {"movies_theaters.is_showing": true} )
  .groupBy("movies.movie_id")
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
    .groupBy("movies.movie_id")
    .first();
}

function readTheaters(movieId) {
  return knex("movies_theaters as mt")
  .join("theaters as t", "mt.theater_id", "t.theater_id")
  .select("*")
  .where({movie_id: movieId, is_showing: true })
}
  
function readReviews(movieId) {
    return knex("movies as m")
    .join("reviews as r" , "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({"m.movie_id": movieId})
    .select("*")
    .then((reviews) => reviews.map(addCriticDetails))
  }


module.exports = {
  list,
  listIsShowing,
  read,
  readTheaters,
  readReviews,
};
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  organization_name: "critic.organization_name",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
});
async function findReviewsForMovie(movieId){
   return await knex("movies as m")
    .join("reviews as r", "m.movie_id","r.movie_id")
    .where({"r.movie_id": movieId});
}
async function addCriticToReviews(movieId){
  const reviews = Object.values(await findReviewsForMovie(movieId));
  let critic_reviews = [];
  
  for(let i=0; i<reviews.length; i++){       //allows iteration & use of first() for proper
   let id = reviews[i].critic_id;            // query with addCritic
   let critic = await knex("critics as c")
    .where({"c.critic_id": id})
    .first()
    .then(addCritic);
    
    critic_reviews[i] = {...reviews[i],...critic}; // combining the results from this route's queries
  }
  return critic_reviews;
}

async function findTheatersForMovie(movieId){
  return await knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id","mt.movie_id")
    .where({"mt.movie_id": movieId})
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .where({"mt.is_showing": true})
    .select("t.*","mt.is_showing","m.movie_id");
}

async function searchMovies(movieId){
  return await knex("movies")
    .where("movies.movie_id", movieId)
    .select("*")
    .first();
}
async function listShowings(){
  return await knex("movies as m")
    .join("movies_theaters as mt","m.movie_id","mt.movie_id")
    .where({"mt.is_showing": true})
    .distinct()
    .select("m.*")
    .orderBy("m.movie_id");
}
async function list() {
  return await knex("movies").select("*");
}

module.exports={
    listShowings, 
    list, 
    searchMovies, 
    addCriticToReviews, 
    findTheatersForMovie, 
    findReviewsForMovie 
}; 
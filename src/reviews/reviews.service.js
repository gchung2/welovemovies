const knex = require('../db/connection');
const mapProperties = require('../utils/map-properties');

function searchReviews(reviewId){
  return knex("reviews")
    .where("reviews.review_id", reviewId)
    .select("*")
    .first();
}

const addCritic = mapProperties({
  organization_name: "critic.organization_name",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
});
async function updateReview(review){
  await knex("reviews as r")
    .select("r.*")
    .update(review)
    .where({"r.review_id": review.review_id});
  return await knex("reviews as r")   
    .leftJoin("critics as c", "r.critic_id", "c.critic_id")
    .where({"r.critic_id": review.critic_id})
    .first()
    .then(addCritic);
}

function destroyReview(reviewId){
  return knex("reviews")
    .where({"reviews.review_id": reviewId})
    .del();
}

module.exports={ 
  searchReviews, 
  updateReview, 
  destroyReview 
};
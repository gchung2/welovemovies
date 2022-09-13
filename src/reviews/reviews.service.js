const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

function mapCriticsToReviews(reviews) {
  return reviews.map(mapProperties({
      c_critic_id: "critic.critic_id",
      c_preferred_name: "critic.preferred_name",
      c_surname: "critic.surname",
      c_organization_name: "critic.organization_name",
      c_created_at: "critic.created_at",
      c_updated_at: "critic.updated_at"
  }))
}

function find(review_id) {
  return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.review_id")
      .select("r.content")
      .select("r.score")
      .select("r.created_at")
      .select("r.updated_at")
      .select("r.critic_id")
      .select("r.movie_id")
      .select("c.critic_id as c_critic_id")
      .select("c.preferred_name as c_preferred_name")
      .select("c.surname as c_surname")
      .select("c.organization_name as c_organization_name")
      .select("c.created_at as c_created_at")
      .select("c.updated_at as c_updated_at")
      .where({ review_id })
      .then(mapCriticsToReviews)
      .then(reviews => reviews[0])

}

function update(updatedReview) {
  return knex("reviews as r")
      .where({ "review_id": updatedReview.review_id })
      .update({
          score: updatedReview.score,
          content: updatedReview.content
      })
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).first().del();
}

module.exports = {
  find,
  delete: destroy,
  update,
};
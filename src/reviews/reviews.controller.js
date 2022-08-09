const db = require("../db/connection");
const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(request, response, next) {
    const originalUrl = request.originalUrl;
    const reviewId = request.params.reviewId;
    const review = await reviewsService.readReview(reviewId, originalUrl);
    if (review) {
        return next();
    }
    next({
        status: 404,
        message: `Review ${reviewId} cannot be found`
    });
}

async function updateReview(request, response, next) {
    const originalUrl = request.originalUrl; 
    const reviewId = request.params.reviewId;
    let review = await reviewsService.readReview(reviewId,originalUrl);
    const updatedReview = {
        ...review,
        ...request.body.data,
    };
    await reviewsService.updateReview(updatedReview);
    const reviewCritic = await reviewsService.readCritic(reviewId);
    review = await reviewsService.readReview(reviewId,originalUrl);
    review.critic = reviewCritic[0];
    response.json({ data: review });
}

async function deleteReview(request, response, next) {
    const reviewId = request.params.reviewId;
    await reviewsService.deleteReview(reviewId);
    response.sendStatus(204);
}

async function listReviewsByMovieId(request, response, next) {
    const { movieId } = request.params;
    const originalUrl = request.originalUrl;
    if (originalUrl.includes("movie")) {
        let reviews = await reviewsService.readReview(movieId,originalUrl);
        for (let i = 0; i < reviews.length; i++) {
            const reviewCritic = await reviewsService.readCritic(reviews[i].review_id);
            reviews[i].critic = reviewCritic[0];
        }
        response.json({ data: reviews })
    }
    next({
        status: 405,
        message: `${request.method} not allowed for ${request.originalUrl}`,
    })
}

module.exports = {
    update: [reviewExists, asyncErrorBoundary(updateReview)],
    delete: [reviewExists, asyncErrorBoundary(deleteReview)],
    list: [asyncErrorBoundary(listReviewsByMovieId)],
}
const router = require('express').Router({ mergeParams: true });
const controller = require('./movies.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');
const readReviews = require('../reviews/reviews.controller');

router
    .route('/')
    .get(controller.listShowings)
    .all(methodNotAllowed);

router
    .route('/:movieId')
    .get(controller.read)
    .all(methodNotAllowed);

router
    .route('/:movieId/theaters')
    .get(controller.listTheaters)
    .all(methodNotAllowed);

router
    .route('/:movieId/reviews')
    .get(controller.listReviews)
    .all(methodNotAllowed);


module.exports = router;
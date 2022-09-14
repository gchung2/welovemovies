const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//check if review exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found" });
}

function read(req, res) {
  res.json({ data: response.locals.review })
}

async function destroy(req, res) {
  const { reviewId } = req.params;
  await service.delete(reviewId);
  res.sendStatus(204);
}

async function update(req, res) {
  const { reviewId } = req.params;
  await service.update(reviewId, req.body.data);
  res.json({ data: await service.getUpdatedRecord(reviewId) });
}


module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
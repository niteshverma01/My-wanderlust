const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewear.js");
const controllerReview = require("../controllers/review.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(controllerReview.createReview)
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(controllerReview.destroyReview)
);

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { reviewSchema } = require('../schema.js');
const {
  isLoggedIn,
  isReviewAuthor,
  validateReview,
} = require('../middleware.js');

const reviewController = require('../controllers/review.js');

// Add Review
router
  .route('/')
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

// Delete Review
router
  .route('/:reviewId')
  .delete(
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
  );

module.exports = router;

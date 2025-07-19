const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const { listingSchema, reviewSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'you must have to logged in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing.owner);
  // console.log(res.locals.currUser._id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash('error', 'you are not owner of this listings.');
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  // console.log(review);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash('error', 'you are not author of this review.');
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

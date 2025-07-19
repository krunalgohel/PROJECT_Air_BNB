const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.addReview = async (req, res) => {
  // console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = res.locals.currUser._id;
  console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash('success', 'Review Save successfull');

  res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review Delete successfull');
  res.redirect(`/listings/${id}`);
};

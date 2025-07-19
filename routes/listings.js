const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/WrapAsync.js');
const multer = require('multer');
const { storage } = require('../cloudinaryConfig.js');
const upload = multer({ storage });
const { isLoggedIn, validateListing, isOwner } = require('../middleware.js');
const listingController = require('../controllers/listings.js');

router
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.addNewListing)
  );

router.route('/new').get(isLoggedIn, listingController.newListingForm);

router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

router
  .route('/:id/edit')
  .get(isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;

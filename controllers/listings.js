const Listing = require('../models/listing');
const fetch = require('node-fetch');

module.exports.index = async (req, res) => {
  let listData = await Listing.find({});
  res.render('listings/index.ejs', { listData });
};

module.exports.newListingForm = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.addNewListing = async (req, res, next) => {
  const location = req.body.listing.location;
  const result = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${location}&format=geojson&apiKey=${process.env.MAP_TOKEN}`
  );
  const geoLocation = await result.json();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image = { url, filename };
  newListing.geometry = geoLocation.features[0].geometry;
  let savedListing = await newListing.save();
  req.flash('success', 'listing added successfull');
  console.log(savedListing);
  res.redirect('/listings');
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let dataList = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner');
  if (!dataList) {
    req.flash('error', 'listing not found!');
    res.redirect('/listings');
  } else {
    res.render('listings/show.ejs', { dataList });
  }
  // console.log(dataList);
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash('error', 'listing not found!');
    res.redirect('/listings');
  } else {
    let originalImage = editListing.image.url;
    let originalImageUrl = originalImage.replace('/upload', '/upload/w_50');
    res.render('listings/edit.ejs', { editListing, originalImageUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );

  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    editListing.image = { url, filename };
  }

  await editListing.save();

  req.flash('success', 'listing Updated successfull');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash('success', 'listing Deleted successfull');
  res.redirect('/listings');
};

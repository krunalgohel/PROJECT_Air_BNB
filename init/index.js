const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main()
  .then(() => {
    console.log('DB is Connected Successfully.');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '68580718dd86ba7c340648f5',
  }));
  await Listing.insertMany(initData.data);
  console.log('data was initialize.');
};

initDB();

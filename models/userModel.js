const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
  "User",
  new Schema({
    username: String,
    name: String,
    twitterID: String,
    thumbnail: String,
  })
);

module.exports = UserModel;
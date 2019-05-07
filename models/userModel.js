const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
  "User",
  new Schema({
    name: String,
    userid: String,
    displayName: String,
  })
);

module.exports = UserModel;
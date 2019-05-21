const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  name: String,
  path: String,
  date: Date,
  email: String,
  title:String,
  type: String,
  description: String,
  city: String,
  zip: String,
  address: String,
  state: String,
  link: String,
  originalName: String,
  cognitiveScore: Number,

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const event = mongoose.model("Event", eventSchema);
module.exports = event;
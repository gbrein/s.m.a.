const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cognitive = mongoose.model(
  "Cognitive",
  new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sentimentTags: String,
    keyPhrase: String,
    tweets: Array,
    avarageRate: mongoose.Decimal128,
  },
  {timestamps: true}
  ),
);

module.exports = Cognitive;
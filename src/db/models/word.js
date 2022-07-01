const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    translate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'In process',
    },
  },
  { timestamps: true },
);

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema(
  {
    wordId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'ACT',
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;

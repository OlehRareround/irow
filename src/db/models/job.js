const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    data: {
      type: Object,
      required: true,
      to: Number,
      wordId: String,
    },
  },
  { strict: false },
);
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

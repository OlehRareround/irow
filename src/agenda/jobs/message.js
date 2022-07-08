const bot = require('../../bot/connect');
const Training = require('../../db/models/training');

function defineAgendaJobs(agenda) {
  // Define a "job", an sending function that agenda can execute
  // `job` is an object representing the job that agenda schedules.
  // `job.attrs` contains the raw document that's stored in MongoDB, so
  // `job.attrs.data` is how you get the `data` that application passes
  // to `schedule()`

  agenda.define('sendMessage', async (job) => {
    try {
      const { to, wordId } = job.attrs.data;
      await (async () => {
        const training = new Training({ wordId, userId: to });
        training.save();
      })();
      await bot.telegram.sendMessage(to, 'Time to /training!');
    } catch (err) {
      console.error(err);
    }
  });

  // More related jobs
}

module.exports = { defineAgendaJobs };

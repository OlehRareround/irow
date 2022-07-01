const bot = require('../../bot/connect');

function defineAgendaJobs(agenda) {
  // Define a "job", an sending function that agenda can execute
  // `job` is an object representing the job that agenda schedules.
  // `job.attrs` contains the raw document that's stored in MongoDB, so
  // `job.attrs.data` is how you get the `data` that application passes
  // to `schedule()`

  agenda.define('sendMessage', async (job) => {
    try {
      const { to, message } = job.attrs.data;
      await bot.telegram.sendMessage(to, message);
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  });

  // More related jobs
}

module.exports = { defineAgendaJobs };

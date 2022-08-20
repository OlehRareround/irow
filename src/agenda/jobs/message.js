const bot = require('../../bot/connect');
const Training = require('../../db/models/training');
const { messages } = require('../../consts/bot.messages');

function defineAgendaJobs(agenda) {
  agenda.define('sendMessage', async (job) => {
    try {
      const { to, wordId } = job.attrs.data;
      const isAct = await Training.find({ userId: to, status: 'ACT' });
      await (async () => {
        const training = new Training({ wordId, userId: to });
        training.save();
      })();
      if (isAct.length === 0) {
        bot.telegram.sendMessage(to, messages.training);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = { defineAgendaJobs };

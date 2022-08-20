const agenda = require('../initAgenda');

const schedule = {
  sendMessage: (date, to, wordId) => {
    agenda.schedule(date, 'sendMessage', {
      to,
      wordId,
    });
  },
};

module.exports = { schedule };

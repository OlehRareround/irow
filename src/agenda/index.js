require('dotenv').config();
const Agenda = require('agenda');
const { defineAgendaJobs } = require('./jobs/message');

function startAgenda(bot) {
  try {
    const agenda = new Agenda({
      db: { address: process.env.DB_CONFIG, collection: 'jobs' },
    });
    defineAgendaJobs(agenda, bot);
    agenda.start();
    console.log('Agenda scheduler started');
    return agenda;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = { startAgenda };

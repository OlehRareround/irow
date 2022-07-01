require('dotenv').config();
const Agenda = require('agenda');
const { defineAgendaJobs } = require('./jobs/message');

const agenda = new Agenda({
  db: { address: process.env.DB_CONFIG, collection: 'jobs' },
});
defineAgendaJobs(agenda);
console.log('Agenda initialized');

module.exports = agenda;

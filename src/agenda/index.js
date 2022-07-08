const agenda = require('./initAgenda');

async function startAgenda() {
  try {
    agenda.start();
    console.log('Agenda scheduler started');
    return agenda;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { startAgenda };

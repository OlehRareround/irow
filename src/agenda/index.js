const agenda = require('./initAgenda');

async function startAgenda() {
  try {
    agenda.start();
    console.log('Agenda scheduler started');
    return agenda;
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

module.exports = { startAgenda };

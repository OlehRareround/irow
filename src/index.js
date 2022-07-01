require('dotenv').config();
const mongoose = require('mongoose');
const Word = require('./db/models/word');
const { startAgenda } = require('./agenda');
const {
  Telegraf,
  Markup,
  session,
  Scenes: { Stage },
} = require('telegraf');
const { commands } = require('./helpers/const');
const {
  addWordScene,
  addTranslateScene,
  deleteWordScene,
} = require('./scenes');

mongoose
  .connect(process.env.DB_CONFIG)
  .then(() => console.log('Connected to DB'))
  .catch((error) => {
    console.log(error);
    throw new Error(error);
  });

const stage = new Stage([addWordScene, addTranslateScene, deleteWordScene]);

let bot;

if (process.env.PRODUCTION === 'true') {
  bot = new Telegraf(process.env.BOT_TOKEN);
  bot.telegram.setWebhook('https://irow-bot.herokuapp.com/new-message');
  bot.startWebhook(`/new-message`, null, process.env.PORT);
  console.log(`Starting server on PORT: ${process.env.PORT}`);
} else {
  bot = new Telegraf(process.env.BOT_TOKEN_DEV);
  bot.launch();
}

bot.use(session(), stage.middleware());

const agenda = startAgenda(bot);

bot.start(async (ctx) => {
  ctx.reply(`Hi, ${ctx.message.from.first_name}! ${commands}`);
  const to = 380580799;
  const message = 'hello from agenda message 2';
  // await agenda.schedule('today at 06:37pm', 'sendMessage', { to, message });
});

bot.help((ctx) => ctx.reply(commands));

stage.command('cancel', (ctx) => {
  ctx.reply('Leaving scene...');
  ctx.scene.leave();
});

bot.command('words', (ctx) => {
  try {
    ctx.replyWithHTML(
      'add, delete or view your words',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('add', 'btn_add', false),
          Markup.button.callback('delete', 'btn_delete', false),
        ],
        [
          Markup.button.callback('viewAll', 'btn_viewAll', false),
          Markup.button.callback('viewInProcess', 'btn_viewInProcess', false),
          Markup.button.callback('viewComplete', 'btn_viewComplete', false),
        ],
      ]),
    );
  } catch (err) {
    console.error(err);
  }
});

bot.action('btn_add', async (ctx) => {
  await ctx.scene.enter('addWordScene');
  console.log(stage.session);
  console.log(ctx.session);
  ctx.scene.leave();
});

bot.action('btn_viewAll', async (ctx) => {
  const userId = ctx.callbackQuery.from.id.toString();
  const filter = { user: userId };
  const all = await Word.find(filter);
  const result = [];
  all.forEach((obj) => {
    result.push(`${obj.text}\n`);
  });
  const message = `** Status: all **\n\n${result
    .toString()
    .replace(/,/g, '')}\n** Count: ${result.length} **`;
  ctx.reply(message);
});

bot.action('btn_viewInProcess', async (ctx) => {
  const userId = ctx.callbackQuery.from.id.toString();
  const filter = { user: userId, status: 'In process' };
  const InProcess = await Word.find(filter);
  const result = [];
  InProcess.forEach((obj) => {
    result.push(`${obj.text}\n`);
  });
  const message = `** Status: In Process **\n\n${result
    .toString()
    .replace(/,/g, '')}\n** Count: ${result.length} **`;
  ctx.reply(message);
});

bot.action('btn_viewComplete', async (ctx) => {
  const userId = ctx.callbackQuery.from.id.toString();
  const filter = { user: userId, status: 'CMP' };
  const InProcess = await Word.find(filter);
  const result = [];
  InProcess.forEach((obj) => {
    result.push(`${obj.text}\n`);
  });
  const message = `** Status: Complete **\n\n${result
    .toString()
    .replace(/,/g, '')}\n** Count: ${result.length} **`;
  ctx.reply(message);
});

bot.action('btn_delete', async (ctx) => {
  ctx.scene.enter('deleteWordScene');
});

process.once('SIGINT', () => {
  console.log('graceful stopping');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('graceful stopping');
  bot.stop('SIGTERM');
});

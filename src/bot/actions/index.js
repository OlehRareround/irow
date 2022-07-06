const Word = require('../../db/models/word');
const { commands } = require('../helpers');
const { Markup } = require('telegraf');
const bot = require('../connect');
// const agenda = require('../../agenda/initAgenda');

async function initActions() {
  bot.start(async (ctx) => {
    ctx.reply(`Hi, ${ctx.message.from.first_name}! ${commands}`);
    const to = 380580799;
    const message = 'hello from agenda message 3';
    // await agenda.schedule('today at 06:37pm', 'sendMessage', { to, message });
    // await agenda.now('sendMessage', { to, message });
  });

  bot.help((ctx) => ctx.reply(commands));

  bot.command('words', (ctx) => {
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
  });

  bot.command('training', (ctx) => {
    ctx.scene.enter('trainingScene');
  });

  bot.action('btn_add', async (ctx) => {
    await ctx.scene.enter('addWordScene');
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

  console.log('Actions initialized');
}

module.exports = { initActions };

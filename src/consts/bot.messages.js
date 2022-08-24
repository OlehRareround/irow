const start = (userName) => {
  return (
    `Привіт, *${userName}*!` +
    '\n\nЯ допомагаю вчити англійські слова використовуючи метод інтервальних повторень.' +
    '\n\nЯк тільки ти правильно відповідаєш, слово переходить на наступну ітерацію. Всього ітерацій 8.' +
    '\nПерша ітерація через 15хв, друга через 30хв, далі через 3 години, 1 день, 5 днів, 25 днів, 3 місяці і остання через рік.' +
    '\n\nЩоб переглянути доступні команди натискай /help'
  );
};

const wordsInfo = (words, status) => {
  const wordsInString = words.toString().replace(/,/g, '');
  const messHeader = `*Status: ${status}*\n`;
  let messBody = '';
  const messFooter = `\n*Count: ${words.length}*`;

  if (status === 'In process') {
    messBody = `*(word - nextRun)*\n\n${wordsInString}`;
  } else {
    messBody = `\n${wordsInString}`;
  }
  return messHeader.concat(messBody).concat(messFooter);
};

const training = 'Time to /training!';

const error = 'Error, please try again later.';

const addTranslateScene = {
  enter: 'Enter the translate:',
  complete:
    'The word is added to your dictionary. Next repeating after 15 minutes.',
};

const addWordScene = {
  enter: 'Enter the word (in English):',
  incorrectWord: 'The word is already in your dictionary',
};

const deleteWordScene = {
  enter: 'Enter the word for delete:',
  incorrectWord: (word) =>
    `The word "${word}" is not defined. Nothing to delete.`,
  complete: (word) => `The word "${word}" was deleted.`,
};

const trainingScene = {
  enter: {
    ok: (text) => `Enter the translation!\nWord: ${text}`,
    cancel: 'Your dictionary is empty.\nPlease add /words!',
  },
  correct: `*Correct\\!*`,
  incorrect: (text) => `*Incorrect\\!*\nAnswer: ||${text}||`,
  nextRepeat: '\nNext repeating this word after ',
  congratulations: 'Congratulations! You learned this word.',
};

const messages = {
  training,
  start,
  wordsInfo,
  error,
  addTranslateScene,
  addWordScene,
  deleteWordScene,
  trainingScene,
};

module.exports = { messages };

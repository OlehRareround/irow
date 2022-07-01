const addTranslateScene = require('./addTranslate');
const addWordScene = require('./addWord');
const deleteWordScene = require('./deleteWordScene');

module.exports = { ...addTranslateScene, ...addWordScene, ...deleteWordScene };

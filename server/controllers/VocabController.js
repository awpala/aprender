const { DB } = require('../constants');

class VocabController {
  constructor() {
    // auxiliary function
    this.getVocab = this.getVocab.bind(this);

    // controller functions
    this.getUserWord = this.getUserWord.bind(this);
    this.updateWord = this.updateWord.bind(this);
  }

  getVocab(req) {
    const {
      add_new_word: addNewWord,
      check_profile: checkProfile,
      get_user_encounters: getUserEncounters,
      get_user_word_data: getUserWordData,
      get_user_word: getUserWord,
      update_word: updateWord,
    } = req.app.get(DB).vocab;

    const db = {
      addNewWord,
      checkProfile,
      getUserEncounters,
      getUserWordData,
      getUserWord,
      updateWord,
    };

    return db;
  }

  async getUserWord(req, res) {
    let { userId } = req.params;
    userId = +userId;

    const {
      getUserEncounters,
      getUserWord,
    } = this.getVocab(req);

    const [
      { encounters_count: encountersCount }
    ] = await getUserEncounters({ userId });

    const [wordData] = await getUserWord({
      userId,
      encountersCount: +encountersCount,
    });

    res.status(200).send(wordData);
  }

  async updateWord(req, res) {
    let { userId } = req.params;
    userId = +userId;

    const { freqId, isCorrect } = req.body;
    const {
      checkProfile,
      getUserWordData,
      addNewWord,
      updateWord,
    } = this.getVocab(req);

    const [{ count }] = await checkProfile({ userId, freqId });
    const isEncounteredWord = +count > 0;

    let [
      { familiarity_score: familiarityScore, encounters }
    ] = isEncounteredWord
      ? await getUserWordData({ userId, freqId })
      : await addNewWord({ userId, freqId });

    familiarityScore++;
    encounters++;

    const [updatedWord] = await updateWord({
      userId,
      freqId,
      isFamiliar: isCorrect,
      familiarityScore: isCorrect ? familiarityScore : 0,
      encounters,
    });

    res.status(200).send(updatedWord);
  }
}

module.exports = VocabController;

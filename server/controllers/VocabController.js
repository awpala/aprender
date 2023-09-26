const {
  DB,
  httpStatusCodes: {
    OK,
  },
} = require('../constants');

/**
 * Controller for entity `vocab`
 */
class VocabController {
  constructor() {
    // auxiliary function
    this.getVocabData = this.getVocabData.bind(this);

    // controller functions
    this.getUserWord = this.getUserWord.bind(this);
    this.updateWord = this.updateWord.bind(this);
  }

  /**
   * Helper function to extract database mappers for entity `vocab`
   * @param {*} req Express request object
   * @returns Database mappers for entity `vocab`
   */
  getVocabData(req) {
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

  /**
   * Get entity `word` for user provided via param `:userId`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code and `word` data payload
   */
  async getUserWord(req, res) {
    const userId = +req.params.userId;

    const {
      getUserEncounters,
      getUserWord,
    } = this.getVocabData(req);

    const [
      { encounters_count: encountersCount }
    ] = await getUserEncounters({ userId });

    const [wordData] = await getUserWord({
      userId,
      encountersCount: +encountersCount,
    });

    res.status(OK).send(wordData);
  }

  /**
   * Update entity `word` for user provided via param `:userId`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code and updated `word` data payload
   */
  async updateWord(req, res) {
    const userId = +req.params.userId;

    const { freqId, isCorrect } = req.body;
    const {
      checkProfile,
      getUserWordData,
      addNewWord,
      updateWord,
    } = this.getVocabData(req);

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

    res.status(OK).send(updatedWord);
  }
}

module.exports = VocabController;

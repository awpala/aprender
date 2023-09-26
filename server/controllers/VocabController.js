const {
  httpStatusCodes: {
    OK,
  },
} = require('../constants');

const { getMappers } = require('../utilities');

/**
 * Controller for entity `vocab`
 */
class VocabController {
  constructor() {
    this.getUserWord = this.getUserWord.bind(this);
    this.updateWord = this.updateWord.bind(this);
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
    } = getMappers(req).vocab;

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
    } = getMappers(req).vocab;

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

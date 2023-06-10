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
    const db = req.app.get(DB).vocab; 
    return db;
  }

  async getUserWord(req, res) {
    const { userId } = req.params;
    const db = this.getVocab(req);

    const [userEncountersData] = await db.get_user_encounters({ userId: +userId });
    const totalUniqueEncounters = +userEncountersData.encounters_count;

    const [wordData] = await db.get_user_word({
      userId: +userId,
      totalUniqueEncounters,
    });

    res.status(200).send(wordData);
  }

  async updateWord(req, res) {
    const { userId } = req.params;
    const { freqId, isCorrect } = req.body;
    const db = this.getVocab(req);

    const [checkProfile] = await db.check_profile({ userId: +userId, freqId });
    const isEncounteredWord = +checkProfile.count > 0;

    const [userWordData] = isEncounteredWord
      ? await db.get_user_word_data({ userId: +userId, freqId })
      : await db.add_new_word({ userId: +userId, freqId });

    const familiarityScore = userWordData.familiarity_score + 1;
    const encounters = userWordData.encounters + 1;

    const [updatedWord] = await db.update_word({
      userId: +userId,
      freqId,
      isFamiliar: isCorrect,
      familiarityScore: isCorrect ? familiarityScore : 0,
      encounters,
    });

    res.status(200).send(updatedWord);
  }
}

module.exports = VocabController;

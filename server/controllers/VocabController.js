class VocabController {
  constructor() {
    // auxiliary function
    this.getVocab = this.getVocab.bind(this);

    // controller functions
    this.getUserWord = this.getUserWord.bind(this);
    this.updateWord = this.updateWord.bind(this);
  }

  getVocab(req) {
    return req.app.get('db').vocab;
  }

  async getUserWord(req, res) {
    const { userId } = req.params;

    const userEncountersData = await this.getVocab(req).get_user_encounters({ userId: +userId });
    const totalUniqueEncounters = +userEncountersData[0].encounters_count;

    const wordData = await this.getVocab(req).get_user_word({
      userId: +userId,
      totalUniqueEncounters,
    });

    res.status(200).send(wordData[0]);
  }

  async updateWord(req, res) {
    const { userId } = req.params;
    const { freqId, isCorrect } = req.body;

    const checkProfile = await this.getVocab(req).check_profile({ userId: +userId, freqId });
    const isEncounteredWord = +checkProfile[0].count > 0;

    let userWordData, familiarityScore, encounters;

    if (!isEncounteredWord) {
      userWordData = await this.getVocab(req).add_new_word({ userId: +userId, freqId });
    } else {
      userWordData = await this.getVocab(req).get_user_word_data({ userId: +userId, freqId });
    }

    familiarityScore = userWordData[0].familiarity_score + 1;
    encounters = userWordData[0].encounters + 1;

    let updatedWord;

    if (isCorrect) {
      updatedWord = await this.getVocab(req).update_word({
        userId: +userId,
        freqId,
        isFamiliar: true,
        familiarityScore,
        encounters,
      });
    } else {
      updatedWord = await this.getVocab(req).update_word({
        userId: +userId,
        freqId,
        isFamiliar: false,
        familiarityScore: 0,
        encounters,
      });
    }

    res.status(200).send(updatedWord[0]);
  }
}

module.exports = VocabController;

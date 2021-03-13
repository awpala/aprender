module.exports = {
  getUserWord: async (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');

    const userEncountersData = await db.vocab.get_user_encounters({ userId: +userId });
    const totalUniqueEncounters = +userEncountersData[0].encounters_count;

    const wordData = await db.vocab.get_user_word({
      userId: +userId,
      totalUniqueEncounters
    });

    res.status(200).send(wordData[0]);
  },
  updateWord: async (req, res) => {
    const { userId } = req.params;
    const { freqId, isCorrect } = req.body;
    const db = req.app.get('db');

    const checkProfile = await db.vocab.check_profile({ userId: +userId, freqId });
    const isEncounteredWord = +checkProfile[0].count > 0;

    let userWordData, familiarityScore, encounters;

    if (!isEncounteredWord) {
      userWordData = await db.vocab.add_new_word({ userId: +userId, freqId });
    } else {
      userWordData = await db.vocab.get_user_word_data({ userId: +userId, freqId });
    }
    
    familiarityScore = userWordData[0].familiarity_score + 1;
    encounters = userWordData[0].encounters + 1;

    let updatedWord;

    if (isCorrect) {
      updatedWord = await db.vocab.update_word({ userId: +userId, freqId, isFamiliar: true, familiarityScore, encounters })
    } else {
      updatedWord = await db.vocab.update_word({ userId: +userId, freqId, isFamiliar: false, familiarityScore: 0, encounters })
    }

    res.status(200).send(updatedWord[0]);
  }
}
const VocabController = require('./VocabController');

const {
  httpStatusCodes: {
    OK,
  },
} = require('../constants');

const {
  mockDB: { vocab },
  getMockReq,
  getMockRes,
} = require('../testUtilities');

// Mocks
const mockVocabDB = vocab;
const mockReq = getMockReq();
const mockRes = getMockRes();

describe('VocabController', () => {
  let vocabController;

  beforeAll(() => {
    vocabController = new VocabController();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserWord', () => {
    it('should get the user word data and return it', async () => {
      // Arrange
      const userId = 1;
      const encountersCount = 5;
      const wordData = { id: 1, word: 'example', translation: 'example translation' };
      mockReq.params.userId = userId;
      mockVocabDB.get_user_encounters.mockResolvedValueOnce([{ encounters_count: encountersCount }]);
      mockVocabDB.get_user_word.mockResolvedValueOnce([wordData]);

      // Act
      await vocabController.getUserWord(mockReq, mockRes);

      // Assert
      expect(mockVocabDB.get_user_encounters).toHaveBeenCalledWith({ userId });
      expect(mockVocabDB.get_user_word).toHaveBeenCalledWith({ userId, encountersCount });
      expect(mockRes.status).toHaveBeenCalledWith(OK);
      expect(mockRes.send).toHaveBeenCalledWith(wordData);
    });
  });

  describe('updateWord', () => {
    it('should add a new word and update its data if the word is not encountered before', async () => {
      // Arrange
      const userId = 1;
      const freqId = 123;
      const isCorrect = true;
      const count = 0;
      const familiarityScore = 0;
      const encounters = 0;
      const updatedWord = { id: 1, word: 'example', translation: 'example translation' };
      mockReq.params.userId = userId;
      mockReq.body = { freqId, isCorrect };
      mockVocabDB.check_profile.mockResolvedValueOnce([{ count }]);
      mockVocabDB.add_new_word.mockResolvedValueOnce([{ familiarity_score: familiarityScore, encounters }]);
      mockVocabDB.update_word.mockResolvedValueOnce([updatedWord]);

      // Act
      await vocabController.updateWord(mockReq, mockRes);

      // Assert
      expect(mockVocabDB.check_profile).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabDB.add_new_word).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabDB.update_word).toHaveBeenCalledWith({
        userId,
        freqId,
        isFamiliar: isCorrect,
        familiarityScore: familiarityScore + 1,
        encounters: encounters + 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(OK);
      expect(mockRes.send).toHaveBeenCalledWith(updatedWord);
    });

    it('should update the existing word data if the word is encountered before', async () => {
      // Arrange
      const userId = 1;
      const freqId = 123;
      const isCorrect = true;
      const count = 1;
      const familiarityScore = 2;
      const encounters = 3;
      const updatedWord = { id: 1, word: 'example', translation: 'example translation' };
      mockReq.params.userId = userId;
      mockReq.body = { freqId, isCorrect };
      mockVocabDB.check_profile.mockResolvedValueOnce([{ count }]);
      mockVocabDB.get_user_word_data.mockResolvedValueOnce([{ familiarity_score: familiarityScore, encounters }]);
      mockVocabDB.update_word.mockResolvedValueOnce([updatedWord]);

      // Act
      await vocabController.updateWord(mockReq, mockRes);

      // Assert
      expect(mockVocabDB.check_profile).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabDB.get_user_word_data).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabDB.update_word).toHaveBeenCalledWith({
        userId,
        freqId,
        isFamiliar: isCorrect,
        familiarityScore: familiarityScore + 1,
        encounters: encounters + 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(OK);
      expect(mockRes.send).toHaveBeenCalledWith(updatedWord);
    });

    it('should handle an incorrect word and reset the familiarity score', async () => {
      // Arrange
      const userId = 1;
      const freqId = 123;
      const isCorrect = false;
      const count = 1;
      const familiarityScore = 2;
      const encounters = 3;
      const updatedWord = { id: 1, word: 'example', translation: 'example translation' };
      mockReq.params.userId = userId;
      mockReq.body = { freqId, isCorrect };
      mockVocabDB.check_profile.mockResolvedValueOnce([{ count }]);
      mockVocabDB.get_user_word_data.mockResolvedValueOnce([{ familiarity_score: familiarityScore, encounters }]);
      mockVocabDB.update_word.mockResolvedValueOnce([updatedWord]);

      // Act
      await vocabController.updateWord(mockReq, mockRes);

      // Assert
      expect(mockVocabDB.check_profile).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabDB.get_user_word_data).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabDB.update_word).toHaveBeenCalledWith({
        userId,
        freqId,
        isFamiliar: isCorrect,
        familiarityScore: 0,
        encounters: encounters + 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(OK);
      expect(mockRes.send).toHaveBeenCalledWith(updatedWord);
    });
  });
});

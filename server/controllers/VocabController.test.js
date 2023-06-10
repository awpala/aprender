const VocabController = require('./VocabController');

// Mock vocab data
const mockVocabData = {
  add_new_word: jest.fn(),
  check_profile: jest.fn(),
  get_user_encounters: jest.fn(),
  get_user_word_data: jest.fn(),
  get_user_word: jest.fn(),
  update_word: jest.fn(),
};

// Mock Express request and response objects
const mockReq = {
  app: {
    get: jest.fn().mockReturnValue({ vocab: mockVocabData }),
  },
  params: {},
  body: {},
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};

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
      mockVocabData.get_user_encounters.mockResolvedValueOnce([{ encounters_count: encountersCount }]);
      mockVocabData.get_user_word.mockResolvedValueOnce([wordData]);

      // Act
      await vocabController.getUserWord(mockReq, mockRes);

      // Assert
      expect(mockVocabData.get_user_encounters).toHaveBeenCalledWith({ userId });
      expect(mockVocabData.get_user_word).toHaveBeenCalledWith({ userId, encountersCount });
      expect(mockRes.status).toHaveBeenCalledWith(200);
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
      mockVocabData.check_profile.mockResolvedValueOnce([{ count }]);
      mockVocabData.add_new_word.mockResolvedValueOnce([{ familiarity_score: familiarityScore, encounters }]);
      mockVocabData.update_word.mockResolvedValueOnce([updatedWord]);

      // Act
      await vocabController.updateWord(mockReq, mockRes);

      // Assert
      expect(mockVocabData.check_profile).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabData.add_new_word).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabData.update_word).toHaveBeenCalledWith({
        userId,
        freqId,
        isFamiliar: isCorrect,
        familiarityScore: familiarityScore + 1,
        encounters: encounters + 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
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
      mockVocabData.check_profile.mockResolvedValueOnce([{ count }]);
      mockVocabData.get_user_word_data.mockResolvedValueOnce([{ familiarity_score: familiarityScore, encounters }]);
      mockVocabData.update_word.mockResolvedValueOnce([updatedWord]);

      // Act
      await vocabController.updateWord(mockReq, mockRes);

      // Assert
      expect(mockVocabData.check_profile).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabData.get_user_word_data).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabData.update_word).toHaveBeenCalledWith({
        userId,
        freqId,
        isFamiliar: isCorrect,
        familiarityScore: familiarityScore + 1,
        encounters: encounters + 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
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
      mockVocabData.check_profile.mockResolvedValueOnce([{ count }]);
      mockVocabData.get_user_word_data.mockResolvedValueOnce([{ familiarity_score: familiarityScore, encounters }]);
      mockVocabData.update_word.mockResolvedValueOnce([updatedWord]);

      // Act
      await vocabController.updateWord(mockReq, mockRes);

      // Assert
      expect(mockVocabData.check_profile).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabData.get_user_word_data).toHaveBeenCalledWith({ userId, freqId });
      expect(mockVocabData.update_word).toHaveBeenCalledWith({
        userId,
        freqId,
        isFamiliar: isCorrect,
        familiarityScore: 0,
        encounters: encounters + 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(updatedWord);
    });
  });
});

const ProfileController = require('./ProfileController');

const {
  httpStatusCodes: {
    OK,
  },
} = require('../constants');

// Mocks
const {
  mockDB: { profile: mockProfileDB },
  mockReq,
  mockRes,
} = require('../testUtilities');

describe('ProfileController', () => {
  let profileController;

  beforeAll(() => {
    profileController = new ProfileController();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get the user profile and return it', async () => {
      // Arrange
      const userId = 1;
      const userProfile = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockReq.params.userId = userId;
      mockProfileDB.get_user_profile.mockResolvedValueOnce(userProfile);

      // Act
      await profileController.getUserProfile(mockReq, mockRes);

      // Assert
      expect(mockProfileDB.get_user_profile).toHaveBeenCalledWith({ userId });
      expect(mockRes.status).toHaveBeenCalledWith(OK);
      expect(mockRes.send).toHaveBeenCalledWith(userProfile);
    });
  });

  describe('resetUserProfile', () => {
    it('should reset the user profile and return OK', async () => {
      // Arrange
      const userId = 1;
      mockReq.params.userId = userId;

      // Act
      await profileController.resetUserProfile(mockReq, mockRes);

      // Assert
      expect(mockProfileDB.reset_user_profile).toHaveBeenCalledWith({ userId });
      expect(mockRes.sendStatus).toHaveBeenCalledWith(OK);
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete the user profile and return OK', async () => {
      // Arrange
      const userId = 1;
      mockReq.params.userId = userId;

      // Act
      await profileController.deleteUserProfile(mockReq, mockRes);

      // Assert
      expect(mockProfileDB.delete_user_profile).toHaveBeenCalledWith({ userId });
      expect(mockRes.sendStatus).toHaveBeenCalledWith(OK);
    });
  });
});

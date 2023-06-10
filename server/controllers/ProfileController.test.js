const ProfileController = require('./ProfileController');

// Mock profile data
const mockProfileData = {
  delete_user_profile: jest.fn(),
  get_user_profile: jest.fn(),
  reset_user_profile: jest.fn(),
};

// Mock Express request and response objects
const mockReq = {
  app: {
    get: jest.fn().mockReturnValue({ profile: mockProfileData }),
  },
  params: {},
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
};

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
      mockProfileData.get_user_profile.mockResolvedValueOnce(userProfile);

      // Act
      await profileController.getUserProfile(mockReq, mockRes);

      // Assert
      expect(mockProfileData.get_user_profile).toHaveBeenCalledWith({ userId });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(userProfile);
    });
  });

  describe('resetUserProfile', () => {
    it('should reset the user profile and return 200', async () => {
      // Arrange
      const userId = 1;
      mockReq.params.userId = userId;

      // Act
      await profileController.resetUserProfile(mockReq, mockRes);

      // Assert
      expect(mockProfileData.reset_user_profile).toHaveBeenCalledWith({ userId });
      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete the user profile and return 200', async () => {
      // Arrange
      const userId = 1;
      mockReq.params.userId = userId;

      // Act
      await profileController.deleteUserProfile(mockReq, mockRes);

      // Assert
      expect(mockProfileData.delete_user_profile).toHaveBeenCalledWith({ userId });
      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});

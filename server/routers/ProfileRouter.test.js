const { ProfileRouter } = require('.')
const { ProfileController } = require('../controllers');
const {
  routes: { PROFILE },
  urlParams: { userId },
} = require('../constants');

const mockApp = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

describe('ProfileRouter', () => {
  let profileRouter;
  let profileController;

  beforeEach(() => {
    profileController = new ProfileController();
    profileRouter = new ProfileRouter(mockApp);
  });

  it('should configure routes', async () => {
    // Act
    profileRouter.configure(mockApp);

    // Assert
    expect(mockApp.get).toHaveBeenCalledTimes(1);
    expect(mockApp.get).toHaveBeenCalledWith(`${PROFILE}/${userId}`, expect.any(Function));

    expect(mockApp.post).toHaveBeenCalledTimes(1);
    expect(mockApp.post).toHaveBeenCalledWith(`${PROFILE}/${userId}`, expect.any(Function));

    expect(mockApp.delete).toHaveBeenCalledTimes(1);
    expect(mockApp.delete).toHaveBeenCalledWith(`${PROFILE}/${userId}`, expect.any(Function));

    // Restore the original methods
    jest.restoreAllMocks();
  });
});

const { ProfileRouter } = require('.')
const {
  routes: { PROFILE },
  urlParams: { userId },
} = require('../constants');

const { mockApp } = require('../testUtilities');

describe('ProfileRouter', () => {
  let profileRouter;

  beforeEach(() => {
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

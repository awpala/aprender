const { AuthRouter } = require('.')
const {
  routes: { AUTH },
} = require('../constants');

const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
};

describe('AuthRouter', () => {
  let authRouter;

  beforeEach(() => {
    authRouter = new AuthRouter(mockApp);
  });

  it('should configure routes', async () => {
    // Act
    authRouter.configure(mockApp);

    // Assert
    expect(mockApp.post).toHaveBeenCalledTimes(4);
    expect(mockApp.post).toHaveBeenCalledWith(`${AUTH}/register`, expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith(`${AUTH}/login`, expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith(`${AUTH}/guest`, expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith(`${AUTH}/logout`, expect.any(Function));

    expect(mockApp.get).toHaveBeenCalledTimes(1);
    expect(mockApp.get).toHaveBeenCalledWith(`${AUTH}/session`, expect.any(Function));

    // Restore the original methods
    jest.restoreAllMocks();
  });
});

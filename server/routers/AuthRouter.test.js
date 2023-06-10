const { AuthRouter } = require('.')
const { AuthController } = require('../controllers');
const {
  routes: { AUTH },
} = require('../constants');

const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
};

describe('AuthRouter', () => {
  let authRouter;
  let authController;

  beforeEach(() => {
    authController = new AuthController();
    authRouter = new AuthRouter();
  });

  it('should configure routes', async () => {
    // Arrange
    jest.spyOn(authController, 'register').mockImplementation();
    jest.spyOn(authController, 'login').mockImplementation();
    jest.spyOn(authController, 'loginGuest').mockImplementation();
    jest.spyOn(authController, 'getSession').mockImplementation();
    jest.spyOn(authController, 'logout').mockImplementation();

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

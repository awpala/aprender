const bcrypt = require('bcryptjs');
const AuthController = require('./AuthController');

const {
  httpStatusCodes: {
    OK,
    CREATED,
    ACCEPTED,
    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,
  },
} = require('../constants');

// Mock users data
const mockUsersData = {
  check_user: jest.fn(),
  register_user: jest.fn(),
};

// Mock Express request and response objects
const mockReq = {
  app: {
    get: jest.fn().mockReturnValue({ users: mockUsersData }),
  },
  body: {},
  session: {
    destroy: jest.fn(),
  },
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
};

describe('AuthController', () => {
  let authController;

  beforeEach(() => {
    authController = new AuthController();
    mockReq.session.user = undefined;
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and set the session', async () => {
      // Arrange
      const newUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe' };
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      bcrypt.genSaltSync = jest.fn().mockReturnValue('salt');
      bcrypt.hashSync = jest.fn().mockReturnValue(hashedPassword);
      mockReq.body = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        password,
      };
      mockUsersData.check_user.mockResolvedValueOnce([]);
      mockUsersData.register_user.mockResolvedValueOnce([newUser]);

      // Act
      await authController.register(mockReq, mockRes);

      // Assert
      expect(mockUsersData.check_user).toHaveBeenCalledWith({ username: newUser.username });
      expect(mockRes.status).toHaveBeenCalledWith(CREATED);
      expect(mockRes.send).toHaveBeenCalledWith(newUser);
      expect(mockReq.session.user).toEqual(newUser);
    });

    it('should return an error if the username is already in use', async () => {
      // Arrange
      const foundUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe' };
      const password = 'password';
      mockReq.body = {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        username: foundUser.username,
        password,
      };
      mockUsersData.check_user.mockResolvedValueOnce([foundUser]);

      // Act
      await authController.register(mockReq, mockRes);

      // Assert
      expect(mockUsersData.check_user).toHaveBeenCalledWith({ username: foundUser.username });
      expect(mockRes.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(mockRes.send).toHaveBeenCalledWith('Username already in use');
      expect(mockReq.session.user).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should log in a user and set the session', async () => {
      // Arrange
      const foundUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', password: 'hashedPassword' };
      const password = 'password';
      mockReq.body = {
        username: foundUser.username,
        password,
      };
      mockUsersData.check_user.mockResolvedValueOnce([foundUser]);
      bcrypt.compareSync = jest.fn().mockReturnValue(true);

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(mockUsersData.check_user).toHaveBeenCalledWith({ username: foundUser.username });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(mockRes.status).toHaveBeenCalledWith(ACCEPTED);
      expect(mockRes.send).toHaveBeenCalledWith(foundUser);
      expect(mockReq.session.user).toEqual(foundUser);
    });

    it('should return an error if the username is not found', async () => {
      // Arrange
      const username = 'johndoe';
      const password = 'password';
      mockReq.body = {
        username,
        password,
      };
      mockUsersData.check_user.mockResolvedValueOnce([]);

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(mockUsersData.check_user).toHaveBeenCalledWith({ username });
      expect(mockRes.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(mockRes.send).toHaveBeenCalledWith('Username not found');
      expect(mockReq.session.user).toBeUndefined();
    });

    it('should return an error if the password is incorrect', async () => {
      // Arrange
      const foundUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', password: 'hashedPassword' };
      const username = 'johndoe';
      const password = 'password';
      mockReq.body = {
        username,
        password,
      };
      mockUsersData.check_user.mockResolvedValueOnce([foundUser]);
      bcrypt.compareSync = jest.fn().mockReturnValue(false);

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(mockUsersData.check_user).toHaveBeenCalledWith({ username });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, foundUser.password);
      expect(mockRes.status).toHaveBeenCalledWith(UNAUTHORIZED);
      expect(mockRes.send).toHaveBeenCalledWith('Password is incorrect');
      expect(mockReq.session.user).toBeUndefined();
    });
  });

  describe('loginGuest', () => {
    it('should log in as a guest user and set the session', async () => {
      // Arrange
      const guestUser = { id: 1, firstName: 'Guest', lastName: 'User', username: 'guest', password: 'hashedPassword' };
      mockUsersData.check_user.mockResolvedValueOnce([guestUser]);

      // Act
      await authController.loginGuest(mockReq, mockRes);

      // Assert
      expect(mockUsersData.check_user).toHaveBeenCalledWith({ username: 'guest' });
      expect(mockRes.status).toHaveBeenCalledWith(ACCEPTED);
      expect(mockRes.send).toHaveBeenCalledWith(guestUser);
      expect(mockReq.session.user).toEqual(guestUser);
    });
  });

  describe('getSession', () => {
    it('should return the session user if it exists', () => {
      // Arrange
      const sessionUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe' };
      mockReq.session.user = sessionUser;

      // Act
      authController.getSession(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(OK);
      expect(mockRes.send).toHaveBeenCalledWith(sessionUser);
    });

    it('should return NOT_FOUND if the session user does not exist', () => {
      // Arrange
      mockReq.session.user = undefined;

      // Act
      authController.getSession(mockReq, mockRes);

      // Assert
      expect(mockRes.sendStatus).toHaveBeenCalledWith(NOT_FOUND);
    });
  });

  describe('logout', () => {
    it('should destroy the session and return OK', () => {
      // Act
      authController.logout(mockReq, mockRes);

      // Assert
      expect(mockReq.session.destroy).toHaveBeenCalled();
      expect(mockRes.sendStatus).toHaveBeenCalledWith(OK);
    });
  });
});

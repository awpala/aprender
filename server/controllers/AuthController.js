const bcrypt = require('bcryptjs');
const {
  DB,
  httpStatusCodes: {
    OK,
    CREATED,
    ACCEPTED,
    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,
  },
} = require('../constants');

const { getMappers } = require('../utilities');

/**
 * Controller for entity `users`
 */
class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.loginGuest = this.loginGuest.bind(this);
    this.getSession = this.getSession.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Register a new user, including hashing the user-provided
   * password
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code and message
   */
  async register(req, res) {
    const {
      firstName,
      lastName,
      username,
      password,
    } = req.body;

    const { checkUser, registerUser } = getMappers(req).users;

    const [foundUser] = await checkUser({ username });
    if (foundUser) {
      return res.status(BAD_REQUEST).send('Username already in use');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const [newUser] = await registerUser({
      firstName,
      lastName,
      username,
      hashedPassword,
    });
    req.session.user = newUser;
    res.status(CREATED).send(req.session.user);
  }

  /**
   * Log in with an existing user
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code and message
   */
  async login(req, res) {
    const { username, password } = req.body;
    const { checkUser } = getMappers(req).users;
    const [foundUser] = await checkUser({ username });
    if (!foundUser) {
      return res.status(BAD_REQUEST).send('Username not found');
    }

    const isAuthenticated = bcrypt.compareSync(password, foundUser.password);
    if (!isAuthenticated) {
      return res.status(UNAUTHORIZED).send('Password is incorrect');
    }

    delete foundUser.password;
    req.session.user = foundUser;
    res.status(ACCEPTED).send(req.session.user);
  }

  /**
   * Log in as user `guest`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code and message
   */
  async loginGuest(req, res) {
    const { checkUser } = getMappers(req).users;
    const [guestUser] = await checkUser({ username: 'guest' });
    delete guestUser.password;
    req.session.user = guestUser;
    res.status(ACCEPTED).send(req.session.user);
  }

  /**
   * Get active session via service `Session`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code
   */
  getSession(req, res) {
    req.session.user
      ? res.status(OK).send(req.session.user)
      : res.sendStatus(NOT_FOUND);
  }

  /**
   * Destroy active session and log out user
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code
   */
  logout(req, res) {
    req.session.destroy();
    res.sendStatus(OK);
  }
}

module.exports = AuthController;

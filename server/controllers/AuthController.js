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

/**
 * Controller for entity `users`
 */
class AuthController {
  constructor() {
    // auxiliary function
    this.getUsersData = this.getUsersData.bind(this);

    // controller functions
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.loginGuest = this.loginGuest.bind(this);
    this.getSession = this.getSession.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Helper function to extract database mappers for entity `users`
   * @param {*} req Express request object
   * @returns Database mappers for entity `users`
   */
  getUsersData(req) {
    const {
      check_user: checkUser,
      register_user: registerUser,
    } = req.app.get(DB).users;

    const db = {
      checkUser,
      registerUser,
    };

    return db;
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

    const { checkUser, registerUser } = this.getUsersData(req);

    const [foundUser] = await checkUser({ username });
    if (foundUser) {
      return res.status(BAD_REQUEST).send('Username already in use');
    }

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

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
    const { checkUser } = this.getUsersData(req);
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
    const { checkUser } = this.getUsersData(req);
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

const bcrypt = require('bcryptjs');
const { DB } = require('../constants');

class AuthController {
  constructor() {
    // auxiliary function
    this.getUsers = this.getUsers.bind(this);

    // controller functions
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.loginGuest = this.loginGuest.bind(this);
    this.getSession = this.getSession.bind(this);
    this.logout = this.logout.bind(this);
  }

  getUsers(req) {
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

  async register(req, res) {
    const {
      firstName,
      lastName,
      username,
      password,
    } = req.body;

    const { checkUser, registerUser } = this.getUsers(req);

    const [foundUser] = await checkUser({ username });
    if (foundUser) {
      return res.status(400).send('Username already in use');
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
    res.status(201).send(req.session.user);
  }

  async login(req, res) {
    const { username, password } = req.body;
    const { checkUser } = this.getUsers(req);
    const [foundUser] = await checkUser({ username });
    if (!foundUser) {
      return res.status(400).send('Username not found');
    }

    const isAuthenticated = bcrypt.compareSync(password, foundUser.password);
    if (!isAuthenticated) {
      return res.status(401).send('Password is incorrect');
    }

    delete foundUser.password;
    req.session.user = foundUser;
    res.status(202).send(req.session.user);
  }

  async loginGuest(req, res) {
    const { checkUser } = this.getUsers(req);
    const [guestUser] = await checkUser({ username: 'guest' });
    delete guestUser.password;
    req.session.user = guestUser;
    res.status(202).send(req.session.user);
  }

  getSession(req, res) {
    req.session.user
      ? res.status(200).send(req.session.user)
      : res.sendStatus(404);
  }

  logout(req, res) {
    req.session.destroy();
    res.sendStatus(200);
  }
}

module.exports = AuthController;

require('dotenv').config();

const session = require('express-session');

const { SESSION_SECRET } = process.env;

class Session {
  constructor() {
    this.configureSession = this.configureSession.bind(this);
  }

  configureSession(app) {
    const config = {
      resave: false,
      saveUninitialized: true,
      secret: SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
    };
    app.use(session(config));
  }
}

module.exports = Session;

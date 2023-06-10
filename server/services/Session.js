require('dotenv').config();
const session = require('express-session');

const { SESSION_SECRET } = process.env;

class Session {
  constructor() {
    this.config = {
      resave: false,
      saveUninitialized: true,
      secret: SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
    };

    this.configure = this.configure.bind(this);
  }

  configure(app) {
    app.use(session(this.config));
  }
}

module.exports = Session;

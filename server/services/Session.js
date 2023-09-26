require('dotenv').config();
const session = require('express-session');

const { SESSION_SECRET } = process.env;

/**
 * `Session` service
 */
class Session {
  constructor(app) {
    this.config = {
      resave: false,
      saveUninitialized: true,
      secret: SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
    };

    this.app = app;

    this.configure = this.configure.bind(this);
  }

  /**
   * Configure `Session` service as top-level middleware
   */
  configure() {
    const { app, config } = this;
    app.use(session(config));
  }
}

module.exports = Session;

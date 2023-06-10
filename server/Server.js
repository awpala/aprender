require('dotenv').config();
const express = require('express');
const path = require('path');

const { BUILD_DIR } = require('./constants');

const { SERVER_PORT } = process.env;

const {
  Database,
  Session,
  Router,
} = require('./services');

class Server {
  constructor() {
    this.app = express();

    // services
    this.db = new Database();
    this.session = new Session();
    this.router = new Router();

    // auxiliary function
    this.start = this.start.bind(this);

    // configuration methods
    this.configureTopLevelMiddleware = this.configureTopLevelMiddleware.bind(this);
    this.configureRoutes = this.configureRoutes.bind(this);
    this.configureStaticFiles = this.configureStaticFiles.bind(this);
    this.configureSession = this.configureSession.bind(this);
    this.connectToDatabase = this.connectToDatabase.bind(this);
    this.configureRoutes = this.configureRoutes.bind(this);
  }

  async start() {
    try {
      await this.configureTopLevelMiddleware();
      this.configureRoutes();
      this.app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));
    } catch (err) {
      console.error('Error starting the server:', err);
    }
  }

  async configureTopLevelMiddleware() {
    try {
      this.app.use(express.json());
      this.configureStaticFiles();
      this.configureSession();
      await this.connectToDatabase();
    } catch (err) {
      console.error('Error configuring top-level middleware:', err);
    }
  }

  configureStaticFiles() {
    // build configuration (client redirect)
    this.app.use(express.static(`${__dirname}/${BUILD_DIR}`));
  }

  configureSession() {
    const { session, app } = this;
    session.configure(app);
  }

  async connectToDatabase() {
    try {
      const { db, app } = this;
      await db.connect(app);
      console.log('db connected');
    } catch (err) {
      console.error('Error configuring the database:', err);
    }
  }

  configureRoutes() {
    const { router, app } = this;

    router.configure(app);

    // build configuration (client redirect)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, `${BUILD_DIR}/index.html`));
    });
  }
}

module.exports = Server;

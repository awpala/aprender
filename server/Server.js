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
    this.db = new Database(this.app);
    this.session = new Session(this.app);
    this.router = new Router(this.app);

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
      const { configureTopLevelMiddleware, configureRoutes, app } = this;
      await configureTopLevelMiddleware();
      configureRoutes();
      app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));
    } catch (err) {
      console.error('Error starting the server:', err);
    }
  }

  async configureTopLevelMiddleware() {
    try {
      const {
        app,
        configureStaticFiles, configureSession, connectToDatabase,
      } = this;
      app.use(express.json());
      configureStaticFiles();
      configureSession();
      await connectToDatabase();
    } catch (err) {
      console.error('Error configuring top-level middleware:', err);
    }
  }

  configureStaticFiles() {
    // build configuration (client redirect)
    this.app.use(express.static(`${__dirname}/${BUILD_DIR}`));
  }

  configureSession() {
    this.session.configure();
  }

  async connectToDatabase() {
    try {
      await this.db.connect();
      console.log('db connected');
    } catch (err) {
      console.error('Error configuring the database:', err);
    }
  }

  configureRoutes() {
    const { router, app } = this;

    router.configure();

    // build configuration (client redirect)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, `${BUILD_DIR}/index.html`));
    });
  }
}

module.exports = Server;

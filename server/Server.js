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

/**
 * The Express server app
 */
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

  /**
   * Configure middleware, launch services, and then launch the Express server app
   */
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

  /**
   * Configure top-level middleware via corresponding services
   */
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

  /**
   * Configure serving of static build files generated via client app
   */
  configureStaticFiles() {
    // build configuration (client redirect)
    this.app.use(express.static(`${__dirname}/${BUILD_DIR}`));
  }

  /**
   * Configure session via service `Session`
   */
  configureSession() {
    this.session.configure();
  }

  /**
   * Connect to postgres database via service `Database`
   */
  async connectToDatabase() {
    try {
      await this.db.connect();
      console.log('db connected');
    } catch (err) {
      console.error('Error configuring the database:', err);
    }
  }

  /**
   * Configure route-level middleware, including serving static files
   * of the client app via wildcard route `'*'`
   */
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

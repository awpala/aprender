require('dotenv').config();
const express = require('express');
const path = require('path');

const { SERVER_PORT } = process.env;

// services
const Database = require('./services/Database');
const Session = require('./services/Session');
const Router = require('./services/Router');


class Server {
  constructor() {
    this.app = express();

    // services
    this.db = new Database();
    this.session = new Session();
    this.router = new Router();

    // configuration methods
    this.configureTopLevelMiddleware = this.configureTopLevelMiddleware.bind(this);
    this.configureRoutes = this.configureRoutes.bind(this);
    this.configureStaticFiles = this.configureStaticFiles.bind(this);
    this.configureSession = this.configureSession.bind(this);
    this.configureDatabase = this.configureDatabase.bind(this);
    this.configureRoutes = this.configureRoutes.bind(this);
  }

  async start() {
    try {
      this.configureTopLevelMiddleware();
      this.configureRoutes();
      await this.configureDatabase();
      this.app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));
    } catch (err) {
      console.error('Error starting the server:', err);
    }
  }

  /* -- CONFIGURATION METHODS -- */

  configureTopLevelMiddleware() {
    this.app.use(express.json());
    this.configureStaticFiles();
    this.configureSession();
  }

  configureStaticFiles() {
    // build configuration (client redirect)
    this.app.use(express.static(`${__dirname}/../build`));
  }

  configureSession() {
    this.session.configureSession(this.app);
  }

  async configureDatabase() {
    try {
      await this.db.connect(this.app);
      console.log('db connected');
    } catch (err) {
      console.error('Error configuring the database:', err);
      throw err;
    }
  }

  configureRoutes() {
    this.router.configureRoutes(this.app);

    // build configuration (client redirect)
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../build/index.html'));
    });
  }
}

module.exports = Server;

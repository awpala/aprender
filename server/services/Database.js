require('dotenv').config();
const massive = require('massive');
const { DB } = require('../constants');

const { CONNECTION_STRING } = process.env;

/**
 * `Database` service
 */
class Database {
  constructor(app) {
    this.config = {
      connectionString: CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    };

    this.app = app;

    this.connect = this.connect.bind(this);
  }

  /**
   * Connect to the postgres database via data mapper [MassiveJS](https://massivejs.org/)
   */
  async connect() {
    try {
      const { config, app } = this;
      const db = await massive(config);
      app.set(DB, db);
    } catch (err) {
      console.error('Error connecting to the database:', err);
    }
  }
}

module.exports = Database;

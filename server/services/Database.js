require('dotenv').config();

const massive = require('massive');

const { CONNECTION_STRING } = process.env;

class Database {
  constructor() {
    this.connect = this.connect.bind(this);
  }

  async connect(app) {
    try {
      const config = {
        connectionString: CONNECTION_STRING,
        ssl: { rejectUnauthorized: false },
      };
      const db = await massive(config);
      app.set('db', db);
    } catch (err) {
      console.error('Error connecting to the database:', err);
    }
  }
}

module.exports = Database;

require('dotenv').config();
const massive = require('massive');

const { CONNECTION_STRING } = process.env;

class Database {
  constructor() {
    this.config = {
      connectionString: CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    };

    this.connect = this.connect.bind(this);
  }

  async connect(app) {
    try {
      const db = await massive(this.config);
      app.set('db', db);
    } catch (err) {
      console.error('Error connecting to the database:', err);
    }
  }
}

module.exports = Database;

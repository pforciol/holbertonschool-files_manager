import MongoClient from 'mongodb';

class DBClient {
  constructor() {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_PORT || 'files_manager';

    MongoClient(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`, {
      useUnifiedTopology: true,
    }).then((client) => {
      this.database = client.db(DB_DATABASE);
    });
  }

  isAlive() {
    return !!this.database;
  }

  async nbUsers() {
    return this.database.collection('users').countDocuments({});
  }

  async nbFiles() {
    return this.database.collection('files').countDocuments({});
  }
}

const dbClient = new DBClient();
export default dbClient;

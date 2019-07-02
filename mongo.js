const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://root:rootpw@localhost:27017/kt?authSource=admin'

const mongoConnect = async () => {
  const connectionOptions = { useNewUrlParser: true };
  const client = await MongoClient.connect(mongoUrl, connectionOptions);
  const db = await client.db();
  db.client = client;
  return db;
};


// DB MIGHT BE IN POOOL BUT WE MIGHT BE GETTING NEW DB INSTANCE, SO GET DB FROM POOL BY DEFAULT ON ALL REQUESTS, DON'T ACEPT IN ARGUMENT
const checkDbConnection = async (db) => {
  // eslint-disable-next-line no-param-reassign
  if (db && db.serverConfig.isConnected()) {
    return db;
  }
  const newDb = await mongoConnect();
  return newDb;
};


module.exports = {
  checkDbConnection,
};

const monk = require('monk');

module.exports = function createConnection(collectionNum) {
  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    const db = monk(MONGODB_URI);
    const database = collectionNum === 1 
                            ? db.get('emotions')
                            : db.get('settings');
    console.log('Connect to MongoDB Database successfully');
    return database;
  } catch (err) {
    console.log(`Err ${err}`);
    return err;
  }
}

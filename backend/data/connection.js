module.exports = async function createConnection(collectionNum) {
  const MONGODB_URI = process.env.MONGODB_URI;

  const monk = require('monk');
  try {
    const db = monk(MONGODB_URI);
    const database = collectionNum === 1 
                            ? db.get('emotions')
                            : db.get('settings');
    console.log('connection success');
    return database;
  } catch (err) {
    console.log(`Err ${err}`);
    return err;
  }
}

module.exports = async function createConnection() {
  const MONGODB_URI = process.env.MONGODB_URI;

  const monk = require('monk');
  try {
    const db = monk(MONGODB_URI);
    const database = db.get('emotions');
    console.log('connection success');
    return database;
  } catch (err) {
    console.log(`Err ${err}`);
  }
}

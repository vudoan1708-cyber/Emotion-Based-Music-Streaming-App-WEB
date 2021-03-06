// configure the connection to MongoDB
const createConnection = require('../data/connection');

// MongoDB database
const getAllData = require('../logic/mongodb/getAllData');
const createOneData = require('../logic/mongodb/createOneData');
const updateOneData = require('../logic/mongodb/updateOneData');

module.exports = async function databaseRouter(app) {

  // configure the connection to MongoDB, default to 0 (personalisation settings)
  let db = createConnection(0);

  // SETTINGS
  // route to get all data
  app.get('/data/get/all', async (req, res) => {
    try {
      const NUM_oF_COLLECTION = req.query.num;
      // re-configure the connection to MongoDB
      db = createConnection(Number(NUM_oF_COLLECTION));

      const data = await getAllData(db);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  // route to create one specific data
  app.post('/data/create', async (req, res) => {
    try {
      const NUM_oF_COLLECTION = req.query.num;
      const PARAM = req.body;
      // re-configure the connection to MongoDB
      db = createConnection(Number(NUM_oF_COLLECTION));
  
      const data = await createOneData(db, PARAM);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  // route to update one specific data
  app.put('/data/update', async (req, res) => {
    try {
      const ID = req.query.id;
      const NUM_oF_COLLECTION = req.query.num;
      const PARAM = req.body;
      // re-configure the connection to MongoDB
      db = createConnection(Number(NUM_oF_COLLECTION));
  
      const data = await updateOneData(db, ID, PARAM);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });
}

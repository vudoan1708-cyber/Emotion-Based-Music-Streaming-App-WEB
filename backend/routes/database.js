// configure the connection to MongoDB
const createConnection = require('../data/connection');

// MongoDB database
const getAllData = require('../logic/mongodb/getAllData');
const createOneData = require('../logic/mongodb/createOneData');
const updateOneData = require('../logic/mongodb/updateOneData');
const deleteData = require('../logic/mongodb/deleteData');

module.exports = async function databaseRouter(app) {

  // configure the connection to MongoDB databases
  // 0 (personalisation settings)
  // 1 (user journey settings)
  const personalisation_db = createConnection(0);
  const user_journey_db = createConnection(1);

  // SETTINGS
  // route to get all data
  app.get('/data/get/all', async (req, res) => {
    try {
      const NUM_OF_COLLECTION = Number(req.query.num);

      const data = NUM_OF_COLLECTION === 0
        ? await getAllData(personalisation_db)
        : await getAllData(user_journey_db);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  // route to create one specific data
  app.post('/data/create', async (req, res) => {
    try {
      const NUM_OF_COLLECTION = Number(req.query.num);
      const PARAM = req.body;
  
      const data = NUM_OF_COLLECTION === 0
        ? await createOneData(personalisation_db, PARAM)
        : await createOneData(user_journey_db, PARAM);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  // route to update one specific data
  app.put('/data/update', async (req, res) => {
    try {
      const ID = req.query.id;
      const NUM_OF_COLLECTION = Number(req.query.num);
      const PARAM = req.body;
  
      const data = NUM_OF_COLLECTION === 0
        ? await updateOneData(personalisation_db, ID, PARAM)
        : await updateOneData(user_journey_db, ID, PARAM);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  // route to delete data
  app.put('/data/delete', async (req, res) => {
    try {
      const ID = req.query.id;
      const NUM_OF_COLLECTION = Number(req.query.num);
  
      const data = NUM_OF_COLLECTION === 0
        ? await deleteData(personalisation_db, ID)
        : await deleteData(user_journey_db, ID);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });
}

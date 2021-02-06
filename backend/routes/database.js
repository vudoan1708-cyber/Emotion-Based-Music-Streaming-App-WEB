// configure the connection to MongoDB
const createConnection = require('../data/connection');

// MongoDB database
const getAllData = require('../logic/mongodb/getAllData');
const createOneData = require('../logic/mongodb/createOneData');
const updateOneData = require('../logic/mongodb/updateOneData');

module.exports = async function databaseRouter(app) {

  // configure the connection to MongoDB
  let db = createConnection(0);

  // SETTINGS
  // route to get all data
  app.get('/data/get/all', async (req, res) => {
    try {
      const data = await getAllData(db);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

  // route to create one specific data
  app.post('/data/create', async (req, res) => {
    try {
      const PARAM = req.body;
  
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
      const PARAM = req.body;
  
      const data = await updateOneData(db, ID, PARAM);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });
}

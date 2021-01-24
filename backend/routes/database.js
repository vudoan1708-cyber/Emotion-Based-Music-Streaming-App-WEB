// configure the connection to MongoDB
const createConnection = require('../data/connection');

// MongoDB database
const getAllData = require('../logic/mongodb/getAllData');
const getOneData = require('../logic/mongodb/getOneData');
const createOneData = require('../logic/mongodb/createOneData');

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

  // route to get one specific data
  app.get('/data/get/one', async (req, res) => {
    const ID = req.query.id;

    const data = await getOneData(db, PARAM);
    console.log(data);
    res.json(data);
  });

  // route to create one specific data
  app.post('/data/create', async (req, res) => {
    const PARAM = req.body;

    const data = await createOneData(db, PARAM);
    res.json(data);
  });

  // route to update one specific data
  // app.post('/data/update', async (req, res) => {
  //   const ID = req.query.id;
  //   const PARAM = req.body;

  //   const data = await updateOneData(db, PARAM);
  //   console.log(data);
  //   res.json(data);
  // });
}

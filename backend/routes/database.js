const fetch = require('node-fetch');

// configure the connection to MongoDB
const createConnection = require('../data/connection');

// MongoDB database
const getAllData = require('../logic/mongodb/getAllData');
const getOneData = require('../logic/mongodb/getOneData');
const createOneData = require('../logic/mongodb/createOneData');

module.exports = async function databaseRouter(app) {

  // configure the connection to MongoDB
  const db = await createConnection();

  // route to get all data
  app.get('/data/get/all', async (req, res) => {
    const data = await getAllData(db);
    console.log(data);
    res.json(data);
  });

  // route to get one specific data
  app.get('/data/get/', async (req, res) => {
    const PARAM = req.query.param;

    const data = await getOneData(db, PARAM);
    console.log(data);
    res.json(data);
  });

  // route to create one specific data
  app.get('/data/create', async (req, res) => {
    const PARAM = req.query.param;

    const data = await createOneData(db, PARAM);
    console.log(data);
    res.json(data);
  });
}

module.exports = async function createOneData(db, data) {

  try {
    // create one
    return await db.insert({/* specify needed data */ data});
  } catch (err) {
    console.log(err);
    return err;
  }
}

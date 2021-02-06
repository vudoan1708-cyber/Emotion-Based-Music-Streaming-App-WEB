module.exports = async function createOneData(db, settings_data) {

  try {
    // create one
    return await db.insert({/* specify needed data */ settings_data});
  } catch (err) {
    console.log(err);
    return err;
  }
}

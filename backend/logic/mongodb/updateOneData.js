module.exports = async function updateOneData(db, settings_data) {

  try {
    // find all
    return await db.insert({/* specify needed data */ settings_data});
  } catch (err) {
    console.log(err);
    return err;
  }
}

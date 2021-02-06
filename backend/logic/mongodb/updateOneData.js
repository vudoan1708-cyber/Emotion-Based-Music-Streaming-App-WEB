module.exports = async function updateOneData(db, id, settings_data) {
  settings_data = { settings_data };
  try {
    // find one data with the id
    const returnedItem = await db.find({
      /* specify needed data */ 
      _id: id,
    });

    // handle no item found for update
    if (!returnedItem) return null;
    else return await db.update({
      /* update needed data */
      _id: id,
    }, {
      $set: settings_data,
    });
  } catch (err) {
    return err;
  }
}

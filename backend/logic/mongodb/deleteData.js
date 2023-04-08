module.exports = async function deleteData(db, id) {
  try {
    // find one data with the id
    const returnedItem = await db.find({
      /* specify needed data */ 
      _id: id,
    });

    // handle no item found for update
    if (!returnedItem) return null;
    return await db.remove({
      /* remove data */
      _id: id,
    });
  } catch (err) {
    return err;
  }
}

module.exports = async function createOneData(PARAM) {

  try {
    // find all
    return await db.insert({/* specify needed data */ PARAM});
  } catch (err) {
    console.log(err);
    return err;
  }
}

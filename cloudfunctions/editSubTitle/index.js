const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { goalId, oldSubTitle,newSubTitle } = event

  if (!goalId || !oldSubTitle) return

  try {
      const _db = await db.collection('goal-records')
          .where({
            goalId: goalId,
             "records.summary":oldSubTitle
          }).get()
      const result = await  _db.data
      let _index = result[0].records.findIndex(x=>x.summary==oldSubTitle)
     let newKey = `records.${_index}.summary`
    //let newKey = "records.0.summary"
    let _data = { [newKey]: newSubTitle}
    //_data[newkey]  = newSubTitle
        let result0 = await db
          .collection('goal-records')
          .where({
            goalId: goalId,
            "records.summary": oldSubTitle
          })
          .update({
            data: _data
          })
    let _result = await db.collection('goal-records').where({ goalId: goalId}).get()
    return _result.data
  } catch (e) {
    console.log(e)
    return e
  }
}

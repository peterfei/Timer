const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { goalId, oldSubTitle,newSubTitle } = event

  if (!goalId || !oldSubTitle) return

  try {
    let result = await db
      .collection('goal-records')
          .where({
            goalId:goalId,"records.summary":oldSubTitle
          })
      .update({
        data: {
          'records.$[].summary': newSubTitle
        }
      })
    let _result = await db.collection('goal-records').where({"records.summary":newSubTitle}).get()
    return _result.data
  } catch (e) {
    console.log(e)
    return e
  }
}

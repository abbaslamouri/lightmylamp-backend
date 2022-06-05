import mongoose from 'mongoose'
import colors from 'colors'

import app from './app'

const dbConnect = async () => {
  try {
    const port = process.env.PORT || '5500'
    const conn = await mongoose.connect(process.env.DB_URI as string)
    console.log(colors.magenta.bold(`Database connection succesfull`))
    app.listen(port, () => {
      console.log(colors.cyan.bold(`server running on port ${port}...`))
    })

    // const db = mongoose.connection.db
    // const collections = await db.listCollections().toArray()
    // console.log('Collections', collections)
    // db.dropCollection('nexthigherassemblies')

    // await conn.dropCollection('eligibilities', () => {

    // })
  } catch (err) {
    console.log(colors.red.bold(`Mongo DB Error ${err}`))
  }
}

export default dbConnect

const fs = require('fs')
const { parse } = require('csv-parse')
// const  mongoose =require ( 'mongoose')
// const  colors =require ( 'colors')
const dotenv = require('dotenv')
// const  dbConnect =require ( '../src/db-connect')

// const Tour = require('../../models/tour')
// const User = require('../../models/user')
// const Review = require('../../models/review')
// const Country = require('../../models/country')
// const State = require('../../models/state')
// const Order = require('../../models/order')

dotenv.config({ path: './config.env' })

// dbConnect()

// const parser = parse({
//   delimiter: ',',
// })

// var parser = parse({ columns: true }, function (err, records) {
//   console.log(records)
// })

// // Read data from file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
// const countries = JSON.parse(fs.readFileSync(`${__dirname}/countries.json`, 'utf-8'))
// const states = JSON.parse(fs.readFileSync(`${__dirname}/states.json`, 'utf-8'))

// const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'))

// console.log(__dirname)

// const processData = (err, data) => {
//   console.log('JJJJJJ')
//   if (err) {
//     console.log(`An error was encountered: ${err}`)
//     return
//   }
//   console.log(data)

//   // data.shift(); // only required if csv has heading row

//   // const userList = data.map(row => new User(...row));

//   // analyseUsers(userList);
// }
const products = []
fs.createReadStream(__dirname + '/products.csv')
  .pipe(parse({ delimiter: ',', columns: true }))
  .on('data', function (row) {
    console.log(row)
  })
  .on('end', function () {
    console.log('finished')
  })
  .on('error', function (error) {
    console.log(error.message)
  })


// Import data into db
const importData = async () => {
  try {
    // const toursCreated = await Tour.create(tours)
    // console.log(colors.green.bold(`${toursCreated.length} tours created successfully...`))
    // const usersCreated = await User.create(users, { validateBeforeSave: false })
    // console.log(colors.green.bold(`${usersCreated.length} users created successfully...`))
    // const reviewsCreated = await Review.create(reviews)
    // console.log(colors.green.bold(`${reviewsCreated.length} reviews created successfully...`))
    // const countriesCreated = await Country.create(countries)
    // console.log(colors.green.bold(`${countriesCreated.length} countries created successfully...`))
    // const statesCreated = await State.create(states)
    // console.log(colors.green.bold(`${statesCreated.length} states created successfully...`))
    // const ordersCreated = await Order.create(orders)
    // console.log(colors.green.bold(`${ordersCreated.length} orders created successfully...`))
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

// Delete all data from db
const deleteData = async () => {
  try {
    // const deletedTours = await Tour.deleteMany()
    // console.log(colors.green.bold(`${deletedTours.deletedCount} tours deleted from the database successfully...`))
    // const deletedUsers = await User.deleteMany()
    // console.log(colors.green.bold(`${deletedUsers.deletedCount} users deleted from the database successfully...`))
    // const deletedReviews = await Review.deleteMany()
    // console.log(colors.green.bold(`${deletedReviews.deletedCount} reviews deleted from the database successfully...`))
    // const deletedCountries = await Country.deleteMany()
    // console.log(
    // 	colors.green.bold(`${deletedCountries.deletedCount} countries deleted from the database successfully...`)
    // )
    // const deletedStates = await State.deleteMany()
    // console.log(colors.green.bold(`${deletedStates.deletedCount} states deleted from the database successfully...`))
    // const deletedOrders = await Order.deleteMany()
    // console.log(colors.green.bold(`${deletedOrders.deletedCount} orders deleted from the database successfully...`))
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}

console.log(process.argv)

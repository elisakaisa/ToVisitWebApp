require('dotenv').config()

const PORT = process.env.PORT

//const url = process.env.MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI /*=== 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI */
console.log('config, uri', MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')
require('dotenv').config()

// internal imports
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const { tokenExtractor } = require('./utils/middleware')
const visitRouter = require('./controllers/visits')
const visitUsersRouter = require('./controllers/visitUsers')
const loginRouter = require('./controllers/login')

//const url = config.MONGODB_URI
const url = process.env.MONGODB_URI

logger.info('connecting to', url)

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

// Middleware
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// Routes
app.use('/api/visits', tokenExtractor, visitRouter)
app.use('/api/users', visitUsersRouter)
app.use('/api/login', loginRouter)

// More middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// internal imports
const logger = require('./utils/logger')
const config = require('./utils/config')
const visitRouter = require('./controllers/visits')

const url = config.MONGODB_URI

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

// Routes
app.use('/api/visits', visitRouter)

module.exports = app
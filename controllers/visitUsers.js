const bcrypt = require('bcryptjs')
const visitUsersRouter = require('express').Router()
const VisitUser = require('../models/visitUser')

visitUsersRouter.get('/', async (request, response) => {
  const users = await VisitUser.find({})
  response.json(users)
})

visitUsersRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const existingUser = await VisitUser.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  // missing username or password
  if (!username) {
    return response.status(400).json({
      error: 'username missing'
    })
  }

  if (!password) {
    return response.status(400).json({
      error: 'password missing'
    })
  }

  // if password too short
  if (password.length < 4) {
    return response.status(400).json({
      error:'password must be at least 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new VisitUser({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = visitUsersRouter
const mongoose = require('mongoose')

const visitUserSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    message: () => 'The username needs to be at least 3 characters'
  },
  passwordHash: String,
})

visitUserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const VisitUser = mongoose.model('VisitUser', visitUserSchema)

module.exports = VisitUser
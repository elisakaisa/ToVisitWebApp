const mongoose = require('mongoose')

// Data model
const visitSchema = new mongoose.Schema({
    what: String,
    where: String,
    category: [String],
    how: [String],
    timeLength: String,
    timeOfYear: {
        spring: Boolean,
        summer: Boolean,
        fall: Boolean,
        winter: Boolean,
        indoors: Boolean,
    },
    priceCategory: String,
    easeOfOrganization: String,
    notes: String,
    done: Boolean,
    totalWalkingDistance: Number,
    actualPrice: Number
})

visitSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Visit', visitSchema)
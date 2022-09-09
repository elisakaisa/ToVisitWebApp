const Visit = require('../models/visit')
const VisitUser = require('../models/visitUser')
const jwt = require('jsonwebtoken')

const initialVisits = [
    {
        "what": "fake 1",
        "where": "fake place 1",
        "category": ["test", "testing"],
        "how": ["train", "car"],
        "timeLength": "month",
        "timeOfYear": {
            "spring": true, 
            "summer": true,
            "fall": false,
            "winter": false,
            "indoors": false},
        "priceCategory": "$$",
        "easeOfOrganization": "easy",
        "notes": "yada yada yada"
    },
    {
        "what": "fake 2",
        "where": "fake place 2",
        "category": ["test", "testing"],
        "how": ["train", "car"],
        "timeLength": "day",
        "timeOfYear": {
            "spring": false, 
            "summer": false,
            "fall": false,
            "winter": false,
            "indoors": true},
        "priceCategory": "$",
        "easeOfOrganization": "hard",
        "notes": "yada yada yada"
    }
]

const newVisit = {
    "what": "fake 3",
    "where": "fake place 3",
    "category": ["test", "testing"],
    "how": ["train", "car"],
    "timeLength": "day",
    "timeOfYear": {
        "spring": false, 
        "summer": false,
        "fall": false,
        "winter": true,
        "indoors": true},
    "priceCategory": "$",
    "easeOfOrganization": "easy",
    "notes": "yada yada yada"
}

const initialUsers = [
    {
      username: 'seconduser',
      name: 'Some Testuser2',
      passwordHash: '$2a$10$SvFULHK8btPq3u6MTgOwieQ9XCn7XKvvfoUDIemTa4PepLKm5Cn1.',
    }
]

// helper function
const visitsInDb = async () => {
    const visits = await Visit.find({})
    console.log(visits)
    return visits.map(visit => visit.toJSON())
}
  
const usersInDb = async () => {
    const users = await VisitUser.find({})
    return users.map(user => user.toJSON())
}
  
const getTokenForUser = (user) => {
    const jwt_user = {
      username: user.username,
      id: user.id
    }
    return jwt.sign(jwt_user, process.env.SECRET)
}

module.exports = { initialVisits, initialUsers, newVisit, visitsInDb, usersInDb, getTokenForUser}
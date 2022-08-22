const visitRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Visit = require('../models/visit')

// get all visit entries
visitRouter.get('/',  (request, response) => {
    //const visits = await Visit.find({})
    //response.json(visits)
    Visit.find({}).then(persons => {
        response.json(persons)
      })
})

// view individual entry
visitRouter.get('/:id', async (request, response) => {
    const visit = await Visit.findById(request.params.id)
    if (visit) {
        response.json(visit)
    } else {
        response.json(404).end()
    }
})

// get visit of certain category
visitRouter.get('/timeLength/:timeLength', async (request, response) => {
    const filteredVisits = await Visit.find({ timeLength: request.params.timeLength })
    if (filteredVisits) {
        response.json(filteredVisits)
    } else {
        response.json(404).end()
    }
})
visitRouter.get('/category/:category', async (request, response) => {
    const filteredVisits = await Visit.find({ category: request.params.category })
    if (filteredVisits) {
        response.json(filteredVisits)
    } else {
        response.json(404).end()
    }
})

// add entry
visitRouter.post('/', async (request, response) => {
    // token verification
    if (!request.decodedToken) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    // check content
    if (!request.body.what) {
        return response.status(400).json({error: 'what missing'})
    }

    // build new entry
    const entry = new Visit({
        what: request.body.what,
        where: request.body.where,
        category: request.body.category,
        how: request.body.how,
        timeOfYear: request.body.timeOfYear,
        timeLength: request.body.timeLength,
        priceCategory:request.body.priceCategory,
        easeOfOrganization: request.body.easeOfOrganization,
        notes: request.body.notes,
        done: false,
        totalWalkingDistance: '',
        actualPrice: ''
     })
    const savedEntry = await entry.save()
    response.status(201).json(savedEntry)
})

// modify entry
visitRouter.patch('/:id', async (request, response) => {
    // token verification
    if (!request.decodedToken) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    console.log('request.body.done', request.body.done)

    let entry = await Visit.findById(request.params.id)

    // update each parameter if needed
    if(request.body.what) {
        entry.what = request.body.what
    }
    if (request.body.where) {
        entry.where = request.body.where
    }
    if (request.body.category) {
        entry.category = request.body.category
    }
    if (request.body.how) {
        entry.how = request.body.how
    }
    if (request.body.timeLength) {
        entry.timeLength = request.body.timeLength
    }
    if (request.body.timeOfYear) {
        entry.timeOfYear = request.body.timeOfYear
    }
    if (request.body.priceCategory) {
        entry.priceCategory = request.body.priceCategory
    }
    if (request.body.easeOfOrganization) {
        entry.easeOfOrganization = request.body.easeOfOrganization
    }
    if (request.body.notes) {
        entry.notes = request.body.notes
    }
    if (request.body.done === true || request.body.done === false) {
        entry.done = request.body.done
    }
    if (request.body.totalWalkingDistance) {
        entry.totalWalkingDistance = request.body.totalWalkingDistance
    }
    if (request.body.actualPrice) {
        entry.actualPrice = request.body.actualPrice
    }
    
    const updatedEntry = await Visit.findByIdAndUpdate(
        request.params.id, 
        entry, 
        { new: true }) // needed to make sure data is updated in the frontend
    response.status(201).json(updatedEntry)
})

// delete entry
visitRouter.delete('/:id', async (request, response) => {
    
    // token verification
    if (!request.decodedToken) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const visitToRemove = await Visit.findByIdAndRemove(request.params.id)
    if(!visitToRemove) {
        return response.status(404).json({error: "entry not found"})
    }
    response.status(204).end()
})


module.exports = visitRouter
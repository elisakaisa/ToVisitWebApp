const { MongoClient } = require('mongodb')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//const api = supertest(app)
const api = supertest.agent(app)

const helper = require('./test_helper')
const db = require('./db')
const Visit = require('../models/visit')

// Setup connection to the database
beforeAll(async () => {
    await db.connect()
    // initialize visitd in the testing database
    let visitObject = new Visit(helper.initialVisits[0])
    await visitObject.save()
    visitObject = new Visit(helper.initialVisits[1])
    await visitObject.save()
})
afterAll(async () => await db.close())

// init
let token = ""

describe('Single MongoMemoryServer', () => {

  describe('GET request', () => {

    test('visits returned as json', async () => {
        await api
            .get('/api/visits')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    

    test('the blogs contain the correct data', async () => {

        const response = await api.get('/api/visits')
    
        const body = response.body.map(visit => {
          delete visit.id
          delete visit.__v
          return visit
        })
        expect(body).toEqual(helper.initialVisits)
    })
    
      
    test('correct amount of data', async () => {
        const response = await api.get('/api/visits')
        expect(response.body).toHaveLength(helper.initialVisits.length)
    })

  })

  describe('login', () => {
    test('create user', async () => {
        const user = await api
          .post('/api/users')
          .send({username: "test", password: "password"})
          .expect(201)
    })

    test('login', async () => {
        const user = await api
          .post('/api/login')
          .send({username: "test", password: "password"})
          .expect(200)

        token = user.body.token
        console.log(token)
    })
  })

  describe('POST request', () => {
    test('should successfully set to the database', async () => {
        const visitsAtStart = await helper.visitsInDb()
        const newVisit = helper.newVisit

        await api
        .post('/api/visits')
        .set('Authorization', `Bearer ${token}`)
        .send(newVisit)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const visitsAtEnd = await helper.visitsInDb()
        expect(visitsAtEnd.length).toBe(visitsAtStart.length + 1)

      })
  })

  
})
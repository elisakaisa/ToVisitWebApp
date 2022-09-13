const { MongoClient } = require('mongodb')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest.agent(app)

const helper = require('./test_helper')
const db = require('./db')
const Visit = require('../models/visit')

// Setup connection to the database
beforeAll(async () => {
    await db.connect()
    // initialize visits in the testing database
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

    let id = null // init id for fetching individual visit

    test('visits contain id', async() => {
      const response = await api.get('/api/visits')
      response.body.forEach(visit => {
        id = visit.id
        expect(visit.id).toBeDefined()
      })
    })

    test('individual visit can be fetched', async () => {
      const response = await api
          .get(`/api/visits/${id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      const body = response.body
      expect(body.what).toEqual(helper.initialVisits[1].what)
    })

    test('individual visit cannot be fetched with an invalid id', async () => {
      const wrongId = "00aa000aaa000000a0000aaa"
      await api
          .get(`/api/visits/${wrongId}`)
          .expect(404)
          .expect('Content-Type', /application\/json/)
    })

  })

  /*---------------------- LOGIN ----------------------*/
  describe('login', () => {
    test('create user', async () => {
        const user = await api
          .post('/api/users')
          .send({username: "test", password: "password"})
          .expect(201)
    })

    test('error when creating an user with missing password', async () => {
      const result = await api
        .post('/api/users')
        .send({username: "test2"})
        .expect(400)
        expect(result.body.error).toContain('password missing')
    })

    test('error when creating an user with an already existing username', async () => {
      const result = await api
        .post('/api/users')
        .send({username: "test", password:"other"})
        .expect(400)
        expect(result.body.error).toContain('username must be unique')
    })

    test('login with correct credentials', async () => {
        const user = await api
          .post('/api/login')
          .send({username: "test", password: "password"})
          .expect(200)

        token = user.body.token
    })

    test('login with wrong credentials', async () => {
      const result = await api
        .post('/api/login')
        .send({username: "test", password: "wrong"})
        .expect(401)
        expect(result.body.error).toContain('invalid username or password')
    })
  })

  let idToModify = null;

  /*----------------------- POST -------------------*/
  describe('POST request', () => {

    test('post request without token', async () => {
      const visitsAtStart = await helper.visitsInDb()

      await api
        .post('/api/visits')
        .send(helper.newVisit)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd.length).toBe(visitsAtStart.length)
    })


    test('post request with token: should successfully add visit', async () => {
      const visitsAtStart = await helper.visitsInDb()
      const newVisit = helper.newVisit

      await api
        .post('/api/visits')
        .set('Authorization', `Bearer ${token}`)
        .send(newVisit)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const visitsAtEnd = await helper.visitsInDb()
      idToModify = visitsAtEnd[visitsAtEnd.length -1].id
      expect(visitsAtEnd.length).toBe(visitsAtStart.length + 1)
      expect(visitsAtEnd[visitsAtStart.length].done).toEqual(false)
      expect(visitsAtEnd[visitsAtStart.length].actualPrice).toEqual(null)
    })
    
  })

  /*----------------------- PATCH -------------------*/
  describe('PATCH request', () => {

    test('what cannot be modified without token', async () => {

      await api
        .patch(`/api/visits/${idToModify}`)
        .send({what: "modified what"})
        .expect(401)
        .expect('Content-Type', /application\/json/) 

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd[visitsAtEnd.length - 1].what).toEqual("fake 3")
      
    })

    test('what can be modified', async () => {

      await api
        .patch(`/api/visits/${idToModify}`)
        .set('Authorization', `Bearer ${token}`)
        .send({what: "modified what"})
        .expect(201)
        .expect('Content-Type', /application\/json/) 

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd[visitsAtEnd.length - 1].what).toEqual("modified what")
    })

    test('done can be modified', async () => {

      const visitsAtStart = await helper.visitsInDb()
      expect(visitsAtStart[visitsAtStart.length - 1].done).toEqual(false)

      await api
        .patch(`/api/visits/${idToModify}`)
        .set('Authorization', `Bearer ${token}`)
        .send({done: true})
        .expect(201)
        .expect('Content-Type', /application\/json/) 

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd[visitsAtEnd.length - 1].done).toEqual(true)
    })
    

    test('actualPrice and totalWalkingDistance can be modified', async () => {

      const visitsAtStart = await helper.visitsInDb()
      expect(visitsAtStart[visitsAtStart.length - 1].actualPrice).toEqual(null)
      expect(visitsAtStart[visitsAtStart.length - 1].totalWalkingDistance).toEqual(null)

      await api
        .patch(`/api/visits/${idToModify}`)
        .set('Authorization', `Bearer ${token}`)
        .send({actualPrice: 1, totalWalkingDistance: 2})
        .expect(201)
        .expect('Content-Type', /application\/json/) 

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd[visitsAtEnd.length - 1].actualPrice).toEqual(1)
      expect(visitsAtEnd[visitsAtEnd.length - 1].totalWalkingDistance).toEqual(2)
    })


    test('actualPrice and totalWalkingDistance cannot be modified with invalid datatypes', async () => {

      const visitsAtStart = await helper.visitsInDb()
      expect(visitsAtStart[visitsAtStart.length - 1].actualPrice).toEqual(1)
      expect(visitsAtStart[visitsAtStart.length - 1].totalWalkingDistance).toEqual(2)

      await api
        .patch(`/api/visits/${idToModify}`)
        .set('Authorization', `Bearer ${token}`)
        .send({actualPrice: "car", totalWalkingDistance: "seat"})
        .expect(201)
        .expect('Content-Type', /application\/json/) 

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd[visitsAtEnd.length - 1].actualPrice).toEqual(1)
      expect(visitsAtEnd[visitsAtEnd.length - 1].totalWalkingDistance).toEqual(2)
    })
  })


  /*----------------------- DELETE -------------------*/
  describe('DELETE request', () => {
    test('cannot be deleted without token', async () => {
      const visitsAtStart = await helper.visitsInDb()

      await api
        .delete(`/api/visits/${idToModify}`)
        .expect(401)
        .expect('Content-Type', /application\/json/) 

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd.length).toBe(visitsAtStart.length)
      
    })
    
    test('can be deleted with token', async () => {
      const visitsAtStart = await helper.visitsInDb()

      await api
        .delete(`/api/visits/${idToModify}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const visitsAtEnd = await helper.visitsInDb()
      expect(visitsAtEnd.length).toBe(visitsAtStart.length - 1)    
    })
  })
  
})
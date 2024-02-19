const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeAll(() => seed(testData))
afterAll(() => db.end());

describe('GET /api/topics', () => {
   test('should return status code 200 and an array of objects with correct keys', () => {
      return request(app).get('/api/topics')
      .expect(200)
      .then((response) => {
         const {topics} = response.body
         expect(topics.length > 0).toBe(true)
         topics.forEach((topic) => {
            expect(topic).toMatchObject({
               slug: expect.any(String),
               description: expect.any(String)
            })
         })
      })
   })
})

describe('GET /api', () => {
   test('responds with same content as json file', () => {
      const expectedEndpoints = require('../endpoints.json')
      return request(app).get('/api')
      .expect(200)
      .then((response) => {
         expect(response.body).toEqual(expectedEndpoints)
      })
   })
})
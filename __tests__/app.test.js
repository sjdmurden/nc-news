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
         expect(JSON.parse(response.text)).toEqual(expectedEndpoints)
      })
   })
})

describe('GET /api/articles/:article_id', () => {
   test('responds with article obj with correct properties', () => {
      return request(app).get('/api/articles/1')
      .expect(200)
      .then((response) => {
         expect(response.body.article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
         })
      })
   })

   test('responds with status 404 and error message when given a valid but non-existent id', () => {
      return request(app).get('/api/articles/9999')
      .expect(404)
      .then((response) => {
         expect(response.body.msg).toBe('article does not exist');
      });
   })

   test('responds with status 400 and error message when given invalid id', () => {
      return request(app).get('/api/articles/rubbish')
      .expect(400)
      .then((response) => {
         expect(response.body.msg).toBe('Bad request')
      })
   })
})
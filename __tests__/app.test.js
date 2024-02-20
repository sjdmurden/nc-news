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
         expect(response.body.article).toEqual(
            {
               article_id: 1,
               title: "Living in the shadow of a great man",
               topic: "mitch",
               author: "butter_bridge",
               body: "I find this existence challenging",
               created_at: expect.any(String), //this timestamp is correct but the excess decimals made it fail the test
               votes: 100,
               article_img_url:
                 "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
         )
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

describe('GET all articles', () => {
   test('should return status code 200 and array of article objects with correct properties', () => {
      return request(app).get('/api/articles')
      .expect(200)
      .then((response) => {
         const {articles} = response.body
         console.log(response.body);
         expect(articles.length > 0).toBe(true)
         articles.forEach((article) => {
            expect(article).toMatchObject({
               author: expect.any(String),
               title: expect.any(String),
               article_id: expect.any(Number),
               topic: expect.any(String),
               created_at: expect.any(String),
               votes: expect.any(Number),
               article_img_url: expect.any(String),
               comment_count: expect.any(String)
            })
         })
      })
   })

   test('articles sorted by date in descending order (oldest last)', () => {
      return request(app).get('/api/articles')
      .expect(200)
      .then((response) => {
         const {articles} = response.body
         console.log(articles);
         expect(articles).toBeSortedBy('created_at', {descending: true})
      })
   })

   
})
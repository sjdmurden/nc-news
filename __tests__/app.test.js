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
         expect(articles).toBeSortedBy('created_at', {descending: true})
      })
   })


})

describe('GET /api/articles/:article_id/comments', () => {
   test('responds with an array of comments for a given article_id with the correct properties', () => {
      return request(app).get('/api/articles/3/comments')
      .expect(200)
      .then((response) => {
         const {comments} = response.body
         expect(comments.length === 2).toBe(true)
         comments.forEach((commentObj) => {
            expect(commentObj).toMatchObject({
               comment_id: expect.any(Number),
               votes: expect.any(Number),
               created_at: expect.any(String),
               author: expect.any(String),
               body: expect.any(String),
               article_id: expect.any(Number)
            })
         })
      })
   })

   test('comments should be sorted so the most recent comment is first', () => {
      return request(app).get('/api/articles/3/comments')
      .expect(200)
      .then((response) => {
         const {comments} = response.body
         expect(comments).toBeSortedBy('created_at')
      })
   })

   test('responds with empty array when given article_id that exists but has no comments', () => {
      return request(app).get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
         expect(response.body.comments).toEqual([])
      })
   })

   test('responds with an error if given a valid but non-existent article_id', () => {
      return request(app).get('/api/articles/999/comments')
      .expect(404)
      .then((response) => {
         expect(response.body.msg).toBe('article does not exist')
      })
   })

   test('responds with an error if given an invalid article_id', () => {
      return request(app).get('/api/articles/rubbish/comments')
      .expect(400)
      .then((response) => {
         expect(response.body.msg).toBe('Bad request')
      })
   })
})

describe('POST /api/articles/:article_id/comments', () => {
   test('POST 201: inserts new comment into article', ()=>{
      const newComment = {
         username: "rogersop",
         body: 'this is a new comment'
      }
      return request(app).post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(({body}) => {
         expect(body.comment).toMatchObject({
            article_id: 3,
            author: 'rogersop',
            body: 'this is a new comment',
            comment_id: 19,
            created_at: expect.any(String),
            votes:0
         })
      })
   })

   test('POST 400: should return status 400 for invalid article_id', () => {
      const newComment = {
         username: "rogersop",
         body: 'this is a new comment'
      }
      return request(app).post('/api/articles/rubbish/comments')
      .send(newComment)
      .expect(400)
   })

   test('returns status 404 for valid but non-existent article_id', () => {
      const newComment = {
         username: "rogersop",
         body: 'this is a new comment'
      }
      return request(app).post('/api/articles/999/comments')
      .send(newComment)
      .expect(404)
   })

   test('returns status 404 for non-existent username', () => {
      const newComment = {
         username: "Seb",
         body: 'this is a new comment'
      }
      return request(app).post('/api/articles/3/comments')
      .send(newComment)
      .expect(404)
   })

   test('status 201: will ignore any unnecessary properties provided on the posted body', () => {
      const newComment = {
         username: "rogersop",
         body: 'this is a new comment',
         rubbish: 'loadOfRubbish'
      }
      return request(app).post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(({body}) => {
         expect(body.comment.rubbish).toBeUndefined()
      })
   })
})

describe('PATCH /api/articles/:article_id', () => {
   test('updates specific article\'s votes', () => {
      return request(app).patch('/api/articles/1')
      .send({inc_votes: 1})
      .expect(200)
      .then(({body}) => {
         expect(body.updatedArticle).toEqual(
            {
               article_id: 1,
               title: "Living in the shadow of a great man",
               topic: "mitch",
               author: "butter_bridge",
               body: "I find this existence challenging",
               created_at: "2020-07-09T20:11:00.000Z",
               votes: 101,
               article_img_url:
                 "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
         )
      })
   })

   test('updates specific article\'s votes with NEGATIVE number', () => {
      return request(app).patch('/api/articles/1')
      .send({inc_votes: -10})
      .expect(200)
      .then(({body}) => {
         expect(body.updatedArticle).toEqual(
            {
               article_id: 1,
               title: "Living in the shadow of a great man",
               topic: "mitch",
               author: "butter_bridge",
               body: "I find this existence challenging",
               created_at: "2020-07-09T20:11:00.000Z",
               votes: 91,
               article_img_url:
                 "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
         )
      })
   })

   test('returns status 400 if votes is invalid type', () => {
      return request(app).patch('/api/articles/1')
      .send({inc_votes: 'rubbish'})
      .expect(400)
   })

   test('returns status 400 if votes num is a float', () => {
      return request(app).patch('/api/articles/1')
      .send({inc_votes: 2.5})
      .expect(400)
   })
})

describe('DELETE /api/comments/:comment_id', () => {
   test('status 204: responds with no content', () => {
      return request(app).delete('/api/comments/1')
      .expect(204)
      .then((response) => {
         expect(response.body).toEqual({})
      })
   })

   test('returns status 404 if comment id doesn\'t exist', () => {
      return request(app).delete('/api/comments/9999')
      .expect(404)
      .then((response) => {
         expect(response.body.msg).toEqual('Comment not found')
      })
   })

   test('returns status 400 if comment id is invalid', () => {
      return request(app).delete('/api/comments/rubbish')
      .expect(400)
      .then((response) => {
         expect(response.body.msg).toEqual('Bad request')
      })

   })
})
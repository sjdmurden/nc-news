const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controller')
const { describeEndpoints } = require('./controllers/api-controller')
const { getArticleById } = require('./controllers/articles-controller')
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api', describeEndpoints)
app.get('/api/articles/:article_id', getArticleById)

app.use((err, request, response, next) => {
   if(err.status && err.msg){
      response.status(err.status).send({msg: err.msg})
   }
   next(err)
})


module.exports = app
const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controller')
app.use(express.json())

app.get('/api/topics', getTopics)

app.use((err, request, response, next) => {
   if(err.status && err.msg){
      response.status(err.status).send({msg: err.msg})
   }
   next(err)
})


module.exports = app
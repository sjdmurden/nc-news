const { selectTopics } = require("../models/topics-model")

exports.getTopics = (request, response, next) => {
   selectTopics()
   .then((topics) => {
      response.status(200).send({ topics })
   }).catch((err) => {
      next(err)
   })
}
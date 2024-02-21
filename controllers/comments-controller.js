const { response } = require('../app');
const { selectArticleById } = require('../models/articles-model');
const { selectCommentsById } = require('../models/comments-model');

exports.getCommentsById = (request, response, next) => {
   const {article_id} = request.params
   if(isNaN(article_id)){
      return response.status(400).send({msg: 'Bad request'})
   }
   const promises = [selectArticleById(article_id), selectCommentsById(article_id)]
   
   Promise.all(promises)
   .then(([article, comments]) => {
      response.status(200).send({ article, comments })
   }).catch((err) => {
      console.log(err);
      if(err.status && err.msg){
         response.status(err.status).send({msg: err.msg})
      }
      next(err)
   })
}

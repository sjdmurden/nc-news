const { response } = require('../app');
const { selectArticleById, selectAllArticles } = require('../models/articles-model')

exports.getArticleById = (request, response, next) => {
   const { article_id } = request.params;
   if(isNaN(article_id)){
      return response.status(400).send({msg: 'Bad request'})
   }
   selectArticleById(article_id)
   .then((article) => {
      response.status(200).send({ article });
   })
   .catch((err) => {
      next(err)
   })
};

exports.getAllArticles = (request, response, next) => {

   selectAllArticles()
   .then((articles) => {
      response.status(200).send({articles})
   })
   .catch((err) => {
      console.log(err);
      next(err)
   })
}
const { response } = require('../app');
const { selectArticleById, selectAllArticles } = require('../models/articles-model');
const { selectTopics } = require('../models/topics-model');

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

exports.getAllArticles = async(request, response, next) => {
   try{
      const {topic} = request.query
      const topics = await selectTopics()
      const topicsArray = topics.map(element => element.slug)

      if(!topic){
         const articles = await selectAllArticles()
         response.status(200).send({articles})
      }

      if(!topicsArray.includes(topic)) {
         response.status(404).send({articles})
      }

      const articles = await selectAllArticles('created_at', topic)
      
      response.status(200).send({articles})
   }
   catch(err){
      console.log(err);
      next(err)
   }
}
const { response } = require('../app');
const { updateArticleVotesInDB } = require('../models/updateVotes-model');

exports.updateVotes = (request, response, next) => {
   const {article_id} = request.params
   const {inc_votes} = request.body

   if (isNaN(article_id)) {
      return response.status(400).send({msg: 'Bad request'})
   }
   if (isNaN(inc_votes) || inc_votes % 1 !== 0) {
      return response.status(400).send({ msg: 'Invalid inc_votes value' });
   }

   updateArticleVotesInDB(article_id, inc_votes)
   .then((updatedArticle) => {
      if (!updatedArticle){
         return response.status(404).send({msg: 'Article not found'})
      }
      response.status(200).send({updatedArticle})
   })
   .catch((err) => {
      next(err)
   })
}
const { response } = require('../app');
const { selectArticleById } = require('../models/articles-model');
const { selectCommentsById, insertComment, selectAllUsernames } = require('../models/comments-model');

exports.getCommentsById = (request, response, next) => {
   const { article_id } = request.params
   if (isNaN(article_id)) {
      return response.status(400).send({ msg: 'Bad request' })
   }
   const promises = [selectArticleById(article_id), selectCommentsById(article_id)]

   Promise.all(promises)
      .then(([article, comments]) => {
         response.status(200).send({ article, comments })
      }).catch((err) => {
         if (err.status && err.msg) {
            response.status(err.status).send({ msg: err.msg })
         }
         next(err)
      })
}

exports.postComment = async (request, response, next) => {
   try {
      const {username, body} = request.body
      const {article_id} = request.params
      
      if (isNaN(article_id)) {
         return response.status(400).send({msg: 'Bad request'})
      }

      const usernames = await selectAllUsernames();
      const usernamesArray = usernames.map(user => user.username)

      if (!usernamesArray.includes(username)) {
         return response.status(404).send({msg: 'Username does not exist'})
      }

      const article = await selectArticleById(article_id)

      if (!article) {
         return response.status(404).send({msg: 'Article does not exist'})
      }

      const comment = await insertComment(article_id, username, body)

      response.status(201).send({comment})
   } catch (err) {
      next(err)
   }
};

const { response } = require('../app');
const { selectCommentsById } = require('../models/comments-model');
const { deleteCommentFromDB } = require('../models/deleteComment-model');

exports.deleteComment = async(request, response, next) => {
   try{
      const {comment_id} = request.params
      if (isNaN(comment_id)) {
         return response.status(400).send({msg: 'Bad request'})
      }
      const deleteComment = await deleteCommentFromDB(comment_id)

      if (!deleteComment) {
         return response.status(404).send({msg:'Comment not found'})
      }
      response.sendStatus(204)
   }
   catch(err) {
      next(err)
   }
}
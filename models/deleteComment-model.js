const db = require('../db/connection')

exports.deleteCommentFromDB = (comment_id) => {
   return db.query(
      `DELETE FROM 
         comments 
      WHERE 
         comment_id = $1`,
      [comment_id]
   ).then((result) => {
      console.log(result);
      return result.rowCount > 0
   });
}
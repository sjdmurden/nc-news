exports.selectCommentsById = (article_id) => {
   return db.query(
      `SELECT * FROM comments
      WHERE article_id = $1`,
      [article_id]
   ).then(({rows}) => {
      if (rows.length === 0) {
         return Promise.reject({status: 404, msg: 'article does not exist'})
      }
      return rows[0]
   })
}
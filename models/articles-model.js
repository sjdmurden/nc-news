const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectArticleById = (article_id) => {
   if(isNaN(article_id)){
      return Promise.reject({status: 400, msg: 'Bad request'})
   }
   return db.query(
      `SELECT * FROM articles
      WHERE article_id = $1`,
      [article_id])
   .then(({rows}) => {
      if (rows.length === 0) {
         return Promise.reject({status: 404, msg: 'article does not exist'})
      }
      return rows[0]
   })
}
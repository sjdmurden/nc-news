const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectArticleById = (article_id) => {
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

exports.selectAllArticles = (sort_by = 'created_at') => {
   const queryString = `
   SELECT 
      articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
   FROM 
      articles
   JOIN 
      comments
   ON 
      articles.article_id = comments.article_id
   GROUP BY 
      articles.article_id
   ORDER BY 
      ${sort_by} DESC;`

   return db.query(queryString)
   .then(({rows}) => {
      return rows
   })
}


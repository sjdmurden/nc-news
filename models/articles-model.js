const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectArticleById = (article_id) => {
   return db.query(
      `SELECT 
         articles.*, COUNT(comments.comment_id) AS comment_count
      FROM 
         articles
      LEFT JOIN 
         comments ON articles.article_id = comments.article_id
      WHERE 
         articles.article_id = $1
      GROUP BY 
         articles.article_id`,
      [article_id])
   .then(({rows}) => {
      if (rows.length === 0) {
         return Promise.reject({status: 404, msg: 'Article does not exist'})
      }
      return rows[0]
   })
}

exports.selectAllArticles = (sort_by = 'created_at', order_by = "DESC", topic = null) => {
   let queryString = `
   SELECT 
      articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
   FROM 
      articles
   JOIN 
      comments
   ON 
      articles.article_id = comments.article_id`;

   if (topic) {
      queryString += `
      WHERE 
         articles.topic = '${topic}'`;
   }

   queryString += `
   GROUP BY 
      articles.article_id
   ORDER BY 
      ${sort_by} ${order_by};`;

   return db.query(queryString)
   .then(({rows}) => {
      return rows
   })
}



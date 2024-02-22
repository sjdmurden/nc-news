const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectCommentsById = (article_id) => {
   return db.query(
      `SELECT * FROM comments
      WHERE article_id = $1`,
      [article_id]
   ).then(({rows}) => {
      return rows
   })
}

exports.insertComment = (article_id, username, body) => {
   return db.query(
      `INSERT INTO comments (article_id, author, body) 
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [article_id, username, body]
   ).then(({rows}) => {
      return rows[0]
   })
}

exports.selectAllUsernames = () => {
   return db.query(
      `SELECT username FROM users`
   ).then(({rows}) => {
      return rows
   })
}
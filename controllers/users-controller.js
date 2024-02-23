const { response } = require('../app');
const { selectAllUsers, selectUserByUsername } = require('../models/users-model');

exports.getAllUsers = (request, response, next) => {
   selectAllUsers()
   .then((users) => {
      response.status(200).send({users})
   })
   .catch((err) => {
      console.log(err);
      next(err)
   })
}

exports.getUserByUsername = (request, response, next) => {
   const {username} = request.params
   selectUserByUsername(username)
   .then((user) => {
      response.status(200).send( {user});
   })
   .catch((err) => {
      next(err)
   })
}
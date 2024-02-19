const fs = require('fs/promises')


exports.describeEndpoints = (request, response, next) => {
   const endpointsFilePath = `${__dirname}/../endpoints.json`

   fs.readFile(endpointsFilePath)
   .then((endpointsData) => {
      const endpoints = JSON.parse(endpointsData)
      response.send(endpoints)
   }).catch((err) => {
      console.log(err);
   })
}
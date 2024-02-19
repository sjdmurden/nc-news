const fs = require('fs/promises')


exports.describeEndpoints = (request, response, next) => {
   const endpointsFilePath = `${__dirname}/../endpoints.json`

   fs.readFile(endpointsFilePath, 'utf-8')
   .then((endpointsData) => {
      response.send(endpointsData)
   }).catch((err) => {
      console.log(err);
   })
}
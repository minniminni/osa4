const http = require('http')
const app = require('./app') // Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app) //Sovelluksen käynnistys

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
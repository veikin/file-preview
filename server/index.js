const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
require('dotenv').config()
const typeorm = require("typeorm");
const EntitySchema = typeorm.EntitySchema;
const path = require('path')
const schedule = require('node-schedule');
const log4js = require('log4js');

log4js.configure({
  appenders: { file: { type: 'file', filename: 'file.log' } },
  categories: { default: { appenders: ['file'], level: 'all' } }
})

const routes = require('./routes')
const { deleteFile, checkDirExist } = require('./utils')

const app = express()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


typeorm
  .createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USETNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNC == 'true' ? true : false,
    entities: [new EntitySchema(require("./entity/File"))],
    logging: true,
    timezone: 'Z'
  })
  .then((connection) => {

    async function start() {
      // Init Nuxt.js
      const nuxt = new Nuxt(config)

      const { host, port } = nuxt.options.server

      // Build only in dev mode
      if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
      } else {
        await nuxt.ready()
      }
      const resolve_path = path.join(__dirname, '../uploads')
      checkDirExist(resolve_path)
      // static file
      app.use(express.static(resolve_path));

      // node schedule
      function scheduleCronstyle() {
        schedule.scheduleJob('0-10 * * * * *', function () {
          deleteFile(resolve_path)
        });
      }
      scheduleCronstyle();

      routes(app, nuxt, connection)

      // Give nuxt middleware to express
      app.use(nuxt.render)

      // Listen the server
      app.listen(port, host)
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      })
    }
    start()
  }).catch(function (error) {
    console.log("Error: ", error);
  });


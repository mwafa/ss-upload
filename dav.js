const dav = require("webdav")

const davClient = dav.createClient(process.env.DAV_URL, {
  username: process.env.DAV_USERNAME,
  password: process.env.DAV_PASSWORD,
})

module.exports = davClient

const ftp = require("basic-ftp")

async function uploadFTPS(src) {
  const client = new ftp.Client()
  client.ftp.verbose = true
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT,
      secure: true,
    })
    console.log(await client.list())
    await client.uploadFrom(src, src)
  } catch (err) {
    console.log(err)
  }
  client.close()
}

module.exports = uploadFTPS

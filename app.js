require("dotenv").config()
const express = require("express")
const fs = require("fs")
const davClient = require("./dav")
const uploadFTPS = require("./ftps")
const getThumb = require("./thumb")

const app = express()

app.get(/thumb\/(([a-z]+)\_([0-9]{8})\_[0-9]+\.jpg)/, async (req, res) => {
  const { 0: filename, 1: username, 2: d } = req.params

  const date = d.slice(0, 4) + "-" + d.slice(4, 6) + "-" + d.slice(6, 8)
  const path = `/studio/${username}/${date}/${filename}`
  const data = await getThumb(path, filename)
  return res.sendFile(data)
})

app.get(/(([a-z]+)\_([0-9]{8})\_[0-9]+\.jpg)/, async (req, res) => {
  const { 0: filename, 1: username, 2: d } = req.params
  const date = d.slice(0, 4) + "-" + d.slice(4, 6) + "-" + d.slice(6, 8)
  const path = `/studio/${username}/${date}/${filename}`

  const exist = await davClient.exists(path)
  if (exist) {
    fs.writeFileSync(filename, await davClient.getFileContents(path))
    uploadFTPS(filename).finally(() => {
      fs.unlinkSync(filename)
    })
  }
  res.json({ path, exist })
})

app.get("/", (_, res) => {
  res.json({ msg: "OK" })
})

app.listen(process.env.PORT || 3000)

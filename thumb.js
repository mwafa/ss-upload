const davClient = require("./dav")
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

async function getThumb(fullPath, filename) {
  const dirLoc = path.join(__dirname, "__tmp__")
  if (!fs.existsSync(dirLoc)) fs.mkdirSync(dirLoc)

  const localPath = path.join(__dirname, "__tmp__", filename)

  if (fs.existsSync(localPath)) {
    return localPath
  } else if (await davClient.exists(fullPath)) {
    const tmpPath = path.join(dirLoc, "out_" + filename)
    fs.writeFileSync(tmpPath, await davClient.getFileContents(fullPath))
    await sharp(tmpPath).resize({ height: 80 }).toFile(localPath)
    fs.unlinkSync(tmpPath)
    return localPath
  } else {
    return false
  }
}

module.exports = getThumb

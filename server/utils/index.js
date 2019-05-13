const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')

const handleRequest = (req, res, nuxt) => {
  nuxt.renderRoute(req.url, {req, res}).then(result => {
    return res.send(result.html)
  }).catch(e => {
    return res.send(e)
  })
}

/**
 * 格式化时间
 */
const transformTime = () => {
  return dayjs().format('YYYYMMDDHHmmssSSS')
}

/**
 * 判断文件夹不存在的时候创建文件夹，使用递归方式
 * @param folderpath 绝对路径
 */
const checkDirExist = (folderpath) => {
  if (fs.existsSync(folderpath)) {
    return true;
  } else {
    if (CheckDirExist(path.dirname(folderpath))) {
      fs.mkdirSync(folderpath);
      return true;
    }
  }
}

/**
 * 写文件
 * @param fileBuffer 上传文件buffer
 * @param transformFilename 格式化文件名
 * @param relative_path 相对路径
 */
const writeFile = (fileBuffer, transformFilename, relative_path) => {
  return new Promise((resolve, reject) => {
    const upload_dir = path.join(__dirname, relative_path)
    checkDirExist(upload_dir)
    let writeStrem = fs.createWriteStream(path.join(upload_dir, transformFilename))
    writeStrem.write(fileBuffer)
    writeStrem.end()
    writeStrem.on('finish', async () => {
      resolve('上传文件成功')
    })
    writeStrem.on('error', (err) => {
      reject('写入文件错误')
    });
  })
}

module.exports = {
  handleRequest,
  transformTime,
  checkDirExist,
  writeFile
}

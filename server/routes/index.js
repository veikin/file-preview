const { handleRequest, transformTime, writeFile } = require('../utils')
const path = require('path')
const multer = require('multer')
const upload = multer()

module.exports = (app, nuxt, connection) => {
  const fileRepository = connection.getRepository("File");

  app.get('/', (req, res) => {
    handleRequest(req, res, nuxt)
  })

  app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    const name = transformTime()
    const end_time = parseInt(name) + 60 * 60 * 24 * 3
    const type = path.extname(file.originalname)
    const transformFilename = name + type
    const file_path = '../../uploads'
    try {
      const message = await writeFile(file.buffer, transformFilename, file_path)
      const create_file = await fileRepository.create({ name, type, end_time })
      const save_file = await fileRepository.save(create_file)
      save_file.name=Buffer.from(save_file.name).toString('base64')
      save_file.url=process.env.BASEURL +'preview/'+ save_file.name
      res.json({ message, data: save_file })
    } catch (error) {
      res.status(400).json({ message: error })
    }
  })

  app.get('/preview/:id', async (req, res) => {
    const name=Buffer.from(req.params.id,'base64').toString()
    const file = await fileRepository.findOne({ where: { name } })
    if (!file) {
      res.data = { code: 400, message: '文件不存在' }
    } else if (parseInt(file.name) + 60 * 60 * 24 * 3 > parseInt(file.end_time)) {
      res.data = { code: 400, message: '文件不存在' }
    } else {
      file.file = process.env.BASEURL + file.name + file.type
      res.data = { code: 200, data: file }
    }
    handleRequest(req, res, nuxt)
  })
}
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
    const file_path = '../uploads'
    try {
      const message = await writeFile(file.buffer, transformFilename, file_path)
      const create_file = await fileRepository.create({ name, type, end_time })
      const save_file = await fileRepository.save(create_file)
      res.json({ message, data: save_file })
    } catch (error) {
      res.status(400).json({ message: error })
    }
  })

  app.get('/preview/:id', async (req, res) => {
    const file = await fileRepository.findOne({ where: { name: req.params.id } })
    if (!file) {
      return res.status(404).send('文件不存在')
    } else if (parseInt(file.name) + 60 * 60 * 24 * 3 > parseInt(file.end_time)) {
      return res.status(404).send('文件不存在')
    }
    file.file = process.env.BASEURL + file.name + file.type
    res.data = file
    handleRequest(req, res, nuxt)
  })
}
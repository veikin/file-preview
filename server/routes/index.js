const { handleRequest, transformTime, writeFile } = require('../utils')
const path = require('path')
const multer = require('multer')
const upload = multer()
const dayjs = require('dayjs')
const log4js = require('log4js');

module.exports = (app, nuxt, connection) => {
  const fileRepository = connection.getRepository("File");

  /**
   * 首页
   */
  app.get('/', (req, res) => {
    handleRequest(req, res, nuxt)
  })

  /**
   * 文件上传
   */
  app.post('/upload', upload.single('file'), async (req, res) => {
    const logger = log4js.getLogger('upload');
    const file = req.file
    
    const word_type = ['.docx', '.dotx']
    const excel_type = ['.xlsx', '.xlsb', '.xls', '.xlsm']
    const ppt_type = ['.pptx', '.ppsx', '.ppt', '.pps', '.potx', '.ppsm']
    const pdf_type = ['.pdf']
    const isLt10M = file.size / 1024 / 1024 < 10;
    const isLt5M = file.size / 1024 / 1024 < 5;
    const extname = path.extname(file.originalname)
    const file_type = [...word_type, ...excel_type, ...ppt_type, ...pdf_type]
    const isType = file_type.indexOf(extname) != -1
    if (!isLt10M && !isType) {
      res.status(400).json({ message: '不支持该文件格式,并且上传文件大小不能超过 10MB' })
    } else if (excel_type.indexOf(extname) != -1 && !isLt5M) {
      res.status(400).json({ message: 'execl文件大小不能超过 5MB' })
    } else if (!isLt10M) {
      res.status(400).json({ message: '上传文件大小不能超过 10MB' })
    } else if (!isType) {
      res.status(400).json({ message: '不支持该文件格式' })
    }

    const name = transformTime()
    const end_time = parseInt(name) + parseInt(process.env.EXPIREDATE)
    const type = path.extname(file.originalname)
    const transformFilename = name + type
    const file_path = '../../uploads'
    try {
      const message = await writeFile(file.buffer, transformFilename, file_path)
      const create_file = await fileRepository.create({ name, type, end_time })
      const save_file = await fileRepository.save(create_file)

      logger.info(save_file.name + save_file.type, req.ip)

      save_file.name = Buffer.from(save_file.name).toString('base64')
      save_file.url = process.env.BASEURL + 'preview/' + save_file.name
      res.json({ message, data: save_file })
    } catch (error) {
      res.status(400).json({ message: error })
    }
  })

  /**
   * 文件预览
   */
  app.get('/preview', async (req, res) => {
    const logger = log4js.getLogger('preview');
    const name = Buffer.from(req.query.id, 'base64').toString()
    const file = await fileRepository.findOne({ where: { name } })
    if (!file) {
      logger.error(file.name + file.type, req.ip)
      res.json({ code: 400, message: '文件不存在' })
    } else if (parseInt(file.end_time) < dayjs().format('YYYYMMDDHHmmssSSS')) {
      logger.error(file.name + file.type, req.ip)
      res.json({ code: 400, message: '文件不存在' })
    } else {
      logger.info(file.name + file.type, req.ip)
      file.file = process.env.BASEURL + file.name + file.type
      res.json({ code: 200, data: file })
    }
  })
}
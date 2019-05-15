# file-preview

> word、excel、ppt 和 pdf 文件在线预览。[查看](https://view.ivanweb.cn/)

## 使用的技术
* Nuxt.js
* express
* element-ui
* typeorm
* [pdf.js](https://mozilla.github.io/pdf.js/)
* word、excel、ppt在线预览[微软接口文档](https://www.microsoft.com/en-us/microsoft-365/blog/2013/04/10/office-web-viewer-view-office-documents-in-a-browser/?eu=true)
* node-schedule

## 实现的功能
* 单文件上传
* 根据文件类型实现word、excel、ppt 和 pdf 文件的在线预览
* 定时任务进行文件删除
* 使用log4js打印上传、预览、定时任务删除文件的日志

## 如何使用

``` bash
# 下载项目
$ git clone https://github.com/XHalso/file-preview.git

# 使用的mysql数据库，在根目录创建mysql的配置文件.env
DB_HOST=localhost
DB_PORT=3306
DB_USETNAME=root
DB_PASSWORD=123456
DB_DATABASE=file_preview
DB_SYNC=true
EXPIREDATE=3000000000
BASEURL=http://localhost:3001/

# 本地启动项目,访问地址是 http://localhost:3001
$ npm install
$ npm run dev
```


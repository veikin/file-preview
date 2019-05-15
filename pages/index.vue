<template>
  <div class="container">
    <div class="content">
      <el-upload
        class="upload"
        drag
        action="/upload"
        :limit="1"
        :before-upload="handleBefore"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :on-exceed="handleExceed">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将单个文件拖到此处，或<em>点击上传</em>单个文件</div>
        <div class="el-upload__tip" slot="tip">
          <p>支持的文件及文件格式：</p>
          <ul>
            <li>word：docx dotx</li>
            <li>excel：xlsx、xlsb、xls、xlsm</li>
            <li>ppt：pptx、 ppsx、 ppt、 pps、 potx、 ppsm</li>
            <li>pdf：pdf</li>
          </ul>
          <p>word 、ppt 和 pdf 文件大小不能超过 10M; excel 文件大小不能超过 5M</p>
        </div>
      </el-upload>
      <div class="btn" v-if="name">
        <nuxt-link :to="'/preview/'+name" target="_blank">
          <el-button class="preview" type="primary" plain>
            预览
          </el-button>
        </nuxt-link>
        <el-input class="copy" placeholder="请输入内容" :value="url" id="foo">
          <el-button class="btn" data-clipboard-target="#foo" slot="append" icon="el-icon-copy-document"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard';

export default {
  data(){
    return{
      name:'',
      url: '',
      word_type:['.docx','.dotx'],
      excel_type:['.xlsx','.xlsb','.xls','.xlsm'],
      ppt_type:['.pptx','.ppsx','.ppt','.pps','.potx','.ppsm'],
      pdf_type:['.pdf']
    }
  },
  mounted() {
    const clipboard = new Clipboard('.btn');
    clipboard.on('success', (e)=> {
      this.$message.success('复制成功')
    });
  },
  methods:{
    handleSuccess(response, file, fileList){
      this.$message.success(response.message)
      this.name=response.data.name
      this.url=response.data.url
    },
    handleError(err, file, fileList){
      this.$message.error(JSON.parse(err.message).message)
    },
    handleBefore(file){
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isLt5M = file.size / 1024 / 1024 < 5;
      const extname=file.name.substring(file.name.lastIndexOf('.'))
      const file_type=[...this.word_type,...this.excel_type,...this.ppt_type,...this.pdf_type]
      const isType=file_type.indexOf(extname) != -1
      if (!isLt10M && !isType) {
        this.$message.error('不支持该文件格式,并且上传文件大小不能超过 10MB');
        return false
      }else if(this.excel_type.indexOf(extname)!= -1 && !isLt5M){
        this.$message.error('execl文件大小不能超过 5MB');
        return false
      }else if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB');
        return false
      }else if (!isType) {
        this.$message.error('不支持该文件格式')
        return false
      }
      return true
    },
    handleRemove(file, fileList){
      this.name=''
      this.url=''
    },
    handleExceed(files, fileList){
      this.$message.error('只支持单文件上传')
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}
.content{
  position: absolute;
  height: 375px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%)
}
.upload{
  height: 335px;
}
.btn{
  position: relative;
  top: 0;
  display: flex;
}
.preview{
  margin-right: 10px;
}
</style>

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
        :on-error="handleError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传word、execl、ppt、pdf文件</div>
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
      word_type:['.doc','.docx','.docm','.dotx','.dotm'],
      excel_type:['.csv','.xls','.xlsx','.xlsm','.xltx','.xltm','.xlsb','.xlam'],
      ppt_type:['.ppt','.pptx','.pptm','.ppsx','.ppsm','.potx','.potm','.ppam'],
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
      const extname=file.name.substring(file.name.lastIndexOf('.'))
      const file_type=[...this.word_type,...this.excel_type,...this.ppt_type,...this.pdf_type]
      if (file_type.indexOf(extname)!=-1) {
        return true
      }else{
        this.$message.error('不支持该文件格式')
        return false
      }
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
  height: 290px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%)
}
.upload{
  height: 250px;
}
.btn{
  position: relative;
  top: 0;
  display: flex;
}
.preview{
  margin-right: 10px;
}
.copy{
}
</style>

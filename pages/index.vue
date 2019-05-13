<template>
  <div class="container">
    <div class="content">
      <el-upload
        class="upload"
        drag
        action="/upload"
        :limit="1"
        :on-success="handleSuccess"
        :on-error="handleError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div class="btn" v-if="name">
        <nuxt-link to="/preview/20190513154036908"><el-button class="preview" type="primary" plain @click="preview">
          预览
        </el-button>
        </nuxt-link>
        <el-input class="copy" placeholder="请输入内容" :value="name" ref="copy_input" disabled>
          <el-button slot="append" icon="el-icon-copy-document" @click="copy_url"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ req, res }) {
    // 请检查您是否在服务器端
    // 使用 req 和 res
    console.log(process.server)
    if (process.server) {
      // console.log(res)
    }
  },
  data(){
    return{
      name:'123'
    }
  },
  methods:{
    handleSuccess(response, file, fileList){
      this.$message.success(response.message)
      this.name=response.data.name
    },
    handleError(err, file, fileList){
      this.$message.error(JSON.parse(err.message).message)
    },
    copy_url(){
      const copyText = document.getElementsByClassName('el-input__inner')[0];
      copyText.select();
      if (document.execCommand("Copy")) {
        this.$message.success('复制成功')
      }
    },
    preview(){
      
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

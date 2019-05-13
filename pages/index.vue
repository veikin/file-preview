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
  async asyncData ({ req, res }) {
    if (process.server) {
      // console.log(res)
    }
  },
  data(){
    return{
      name:'',
      url: ''
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

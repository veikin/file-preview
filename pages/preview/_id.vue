<template>
  <div class="preview">
    <div v-if="isEmpty">文件不存在</div>
    <div v-else class="content">
      <iframe v-if="type=='.pdf'" :src="'/pdfjs/web/viewer.html?file='+file" width='100%' height='100%' scrolling="no">
        您的浏览器不支持PDF阅读
      </iframe>
      <iframe 
        v-else
        :src="'https://view.officeapps.live.com/op/view.aspx?src='+file" 
        width='100%' 
        height='100%' 
        frameborder='1'>
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ req, res }) {
    if (process.server) {
      const code=res.data.code
      if (code==400) {
        return {isEmpty:true}
      }else{
        const type=res.data.data.type
        const file=res.data.data.file
        return {isEmpty:false,type,file}
      }
    }
  }
}
</script>

<style scoped>
.preview, .content {
  height: 100%;
  width: 100%;
}
</style>



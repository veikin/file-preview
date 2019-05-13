<template>
  <div class="preview">
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
</template>

<script>
export default {
  async asyncData ({ req, res }) {
    // 请检查您是否在服务器端
    // 使用 req 和 res
    if (process.server) {
      const type=res.data.type
      const file=res.data.file
      return {type,file}
    }
  }
}
</script>

<style scoped>
.preview {
  height: 100%;
  width: 100%;
}
</style>



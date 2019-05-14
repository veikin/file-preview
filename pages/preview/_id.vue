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
import axios from 'axios'

export default {
  async asyncData ({ params }) {
    let { data } = await axios.get(`/preview`,{
      params:{
        id:params.id
      }
    })
    const code=data.code
    if (code==400) {
      return {isEmpty:true}
    }else{
      const type=data.data.type
      const file=data.data.file
      return {isEmpty:false,type,file}
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



<template>
  <div style="overflow-y: scroll">
    <!-- <pdf
      v-for="i in pagesNumber"
      :key="i"
      :src="src"
      :page="i"
      style="display: inline-block; width: 100%"></pdf> -->

      <iframe src="http://docs.google.com/gview?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true" style="width:100%; height:1000px;" frameborder="0"></iframe>

  </div>
</template>

<script>
  // import pdf from 'vue-pdf'

  export default {
    props: ['content'],


    data() {
      return {
        pagesNumber: []
      }
    },

    mounted() {
    }
  }
</script>

<style scoped>
  div, iframe {
    width: 100%;
    height: 100%;
    /* z-index: -1; */
    margin-right: 30px;
  }
  
</style>

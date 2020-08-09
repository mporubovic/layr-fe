
<template>
    <div>
        <!-- <pdf
            v-for="i in pagesNumber"
            :key="i"
            src="https://cdn.mozilla.net/pdfjs/tracemonkey.pdf"
            :page="i"
            style="display: inline-block; width: 100%"
        ></pdf> -->

        <h2 v-if="contentLoading">Loading PDF</h2>
        <iframe :src="iframes[0]" 
                :style="ifrmDynamicStyle"
                frameborder="0"
                ></iframe>
    </div>
</template>

<script>
// import pdf from "vue-pdf";

export default {
    props: {
        content: {
            type: Array,
            required: true,
        },

        hasFocus: {
            type: Boolean,
            required: true,
        }
    },

    // components: {
    //   pdf
    // },

    data() {
        return {
            pagesNumber: [],
            iframes: [],
            contentLoading: true,
        };
    },

    computed: {
        ifrmDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        }
    },

    mounted() {
            this.content.forEach((element) => {
                var ifrm = document.createElement("iframe");
                ifrm.src = element.file.url;
                setTimeout(() => {
                    this.iframes.push(ifrm.src);
                    this.contentLoading = false;
                }, 1000);
                
        });
    },
};
</script>

<style scoped>
div {
    width: 100%;
    height: 100%;
}
iframe {
    width: 100%;
    height: 100%;


    /* z-index: -1; */
    /* margin-bottom: 30px; */
    /* overflow-y: hidden; */

}
</style>


<template>
    <div>
        <h2 v-if="contentLoading">Loading PDF</h2>        
        
        <div class="pdf-selector" v-if="content.length === 0">
            <file-selector :sources="contentSources"
                            @urlSubmitted="fileSelectorUrlSubmitted">

            </file-selector>
        </div>

        <iframe :src="iframes[0]" 
                v-if="content.length !== 0"
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

    data() {
        return {
            pagesNumber: [],
            iframes: [],
            contentLoading: true,
            contentSources: ['device', 'link']
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

    methods: {
        fileSelectorUrlSubmitted() {
            // this.contentLoading = true
            // this.$emit('programCreatedContent', 'youtube-player', url)
        }
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

.pdf-selector {
    box-sizing: border-box;
    overflow: hidden;
    padding: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
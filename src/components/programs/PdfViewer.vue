
<template>
    <div class="pdf-viewer">
        <h2 v-if="contentLoading">Loading PDF</h2>        
        
        <div class="pdf-selector" v-if="content.length === 0">
            <file-selector :sources="contentSources"
                            @fileSubmitted="fileSelectorPdfSubmitted">

            </file-selector>
        </div>

        <iframe :src="ifrmSrc" 
                v-if="!contentLoading"
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
            iframe: null,
            contentLoading: false,
            contentSources: ['device']
        };
    },

    computed: {
        ifrmDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        },

        ifrmSrc() {
            return this.content[0] ? this.content[0].file.url : null 
        }
    },

    mounted() {
        this.iframe = document.createElement("iframe");
        setTimeout(() => {
            this.contentLoading = false;
        }, 1000);
            
    },

    methods: {
        fileSelectorPdfSubmitted(files) {
            // this.contentLoading = true
            this.$emit('programCreatedContent', 'pdf-viewer', files)
        }
    },
};
</script>

<style>
.pdf-viewer {
    height: 100%;
}

iframe {
    width: 100%;
    height: 100%;
}

.pdf-selector {
    /* box-sizing: border-box; */
    overflow: hidden;
    /* padding: 50px; */
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
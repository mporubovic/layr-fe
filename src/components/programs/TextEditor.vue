<template>
    <div class="text-editor"
            :style="editorDynamicStyle">
        <link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet" />

        <div class="text-editor-toolbar" id="text-editor-toolbar">
        <!-- <div :class="editorId"> -->
        
        </div>
        <h2 v-show="contentLoading">Loading Text Editor</h2>
        
        <div class="text-editor-container-wrapper" v-show="!contentLoading">   
            <div class="text-editor-container" :id="editorId" >
                <p>Hello World!</p>
            </div>
        </div>
    </div>
</template>

<script>
import Quill from "quill";

export default {
    props: {
        cardId: {
            type: Number,
            required: true,
        },
        
        hasFocus: {
            type: Boolean,
            required: true,
        },

        autoSaveInterval: {
            type: Number,
            required: true
        },

        content: {
            type: Array,
            required: true,
        },
    },

    computed: {
        editorId() {
            return "text-editor-container-" + this.cardId
        },

        editorDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        }
    },
    
    mounted() {
        var toolbarOptions =[
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline',],
                        [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
                        ['image', 'link'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                    ];
        
        // setTimeout(() => {
            this.Delta = Quill.import('delta');
            this.change = new this.Delta();
            // console.log(this.change.compose(delta))
            let quill = new Quill("#" + this.editorId, {
                modules: {
                    toolbar: toolbarOptions,
                    // toolbar: [
                    //     [{ 'size': ['small', false, 'large', 'huge'] }],
                    //     ['bold', 'italic', 'underline',],
                    //     [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
                    //     ['image', 'link'],
                    //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    //     [{ 'color': [] }, { 'background': [] }],

                    // ]
                },
                theme: "snow",
            })
            console.log(this.content)
            let parsedText = JSON.parse(this.content[0].text.text)
            
            console.log(parsedText)
            // quill.setContents(parsedText)
            
            // quill.on('text-change', function(delta) {
            quill.on('text-change', (delta) => {
                this.change = this.change.compose(delta);
                });
            
            
            
            this.intervalId = setInterval(() => {
                if (this.change.length() > 0 ) {
                    console.log("AUTO-UPDATE")
                    this.saveContent()
                }
                // console.log('interval')
            }, this.autoSaveInterval);

            // alert(document.getElementsByClassName("ql-toolbar")[0])
            // this.$el.querySelector("#text-editor-toolbar").appendChild(this.$el.querySelector(".ql-toolbar"));
            this.quill = quill;
            

        // setTimeout(() => {
        
            // console.log (quill);
            this.$el.querySelector("#text-editor-toolbar").appendChild(this.$el.querySelector(".ql-toolbar"));
            this.contentLoading = false
        // }, 1000);

    },

    beforeDestroy() {
        if (this.change.length() > 0 ) { 
            this.saveContent()
        }

        
        
    },
    
    destroyed() {
        clearInterval(this.intervalId)
        
    },

    data() {
        return {
            quill: Object,
            contentLoading: true,
            Delta: Quill.import('delta'), 
            change: [],
        }
        
    },

    methods: {
        saveContent() {
            // console.log(this.change)
            let newContent = JSON.parse ( JSON.stringify ( this.content[0] ) )
        
            newContent.text = this.quill.getContents().ops

            // console.log(newContent)
            
            // console.log('Saving text editor changes', change, newContent);
            this.$emit('programUpdatedContent', this.$options._componentTag, newContent)
            
            this.change = new this.Delta();
        }
    },
    
    watch: {
        // content: {
        //     deep: true,
        //     handler(newVal, oldVal) {
        //         console.log(newVal[0].text, oldVal)
        //         this.quill.setContents(newVal[0].text)

        //     }
        // } 
    }
};
</script>

<style>
.text-editor {
    width: 100%;
    height: 100%;
    background-color: white;
    /* box-sizing: border-box; */
    /* overflow-y: scroll; */
    /* overflow: hidden; */
    display: flex;
    flex-direction: column;

}

.text-editor-container-wrapper {
    flex: 1;
    overflow: hidden;
    padding-top: 20px;

    /* overflow-y: scroll; */
}

.text-editor-toolbar {
}

.text-editor-container {
    -webkit-user-select: text;
}

.ql-container.ql-snow {
    border: none !important;
}
.ql-snow.ql-toolbar button {
    height: 28px !important;
}

.ql-snow .ql-picker {
    font-size: 18px !important;
    height: 30px !important;
}


</style>
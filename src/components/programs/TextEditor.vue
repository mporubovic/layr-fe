<template>
    <div class="text-editor"
            :style="editorDynamicStyle">
        <link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet" />

        <div class="text-editor-toolbar" id="text-editor-toolbar">
        <!-- <div :class="editorId"> -->
        
        </div>

        <div class="text-editor-container-wrapper">   
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
        }
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
        });
        // alert(document.getElementsByClassName("ql-toolbar")[0])
        this.$el.querySelector("#text-editor-toolbar").appendChild(this.$el.querySelector(".ql-toolbar"));

        this.quill = quill;
        // console.log (quill);
    },

    data() {
        return {
            quill: Object
        }
        
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
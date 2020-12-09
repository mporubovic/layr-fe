<template>
    <div class="text-editor"
            :style="editorDynamicStyle">
        <h2 v-show="contentLoading">Loading Text Editor</h2>
        
        <div class="text-editor-container-wrapper" v-show="!contentLoading">   
            <div class="text-editor-container" :id="editorId" >
                <editor api-key="k579ttia58ux83p72dnl63ipvrbirtk3hjzzbgvp4frh2bne" :init="tinymcesettings" v-model="localText"/>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";


export default {
    components: {
        'editor': Editor
    },
    
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

        cardUnload: {
            type: Boolean,
        },
    },

    computed: {
        editorId() {
            return "text-editor-" + this.cardId
        },

        editorDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        }
    },
    
    mounted() {
        let text = this.content[0].text.text
        this.localText = text
        this.contentLoading = false

    },

    // beforeDestroy() {
        
    // },
    
    data() {
        let editorChange = this.editorChange
        return {
            contentLoading: true,
            timeout: null,
            localText: null,
            tinymcesettings: {
                selector: ".editor",
                plugins:
                "paste lists advlist autolink link image charmap print table emoticons wordcount codesample fullscreen",
                toolbar_mode: "floating",
                // height: 500,
                height: '100%',
                resize: false,
                toolbar:
                "fontsizeselect | bold italic underline strikethrough | backcolor | alignleft aligncenter alignright alignjustify | numlist bullist",
                menubar: "edit insert tools",
                menu: {
                    edit: { title: "Edit", items: "undo redo | copy paste cut" },
                    // view: {},
                    insert: {
                        title: "Insert",
                        items: "image link | inserttable | charmap emoticons | codesample",
                    },
                    tools: { title: "Tools", items: "print fullscreen | wordcount" },
                },
                image_description: false,
                image_dimensions: false,
                file_picker_types: "image",
                ui_container: '#text-editor-136',
                // block_unsupported_drop: false,
                content_style:
                "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap'); body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }",
            
                images_upload_handler: this.imageUploadHandler,
                setup: function(editor) {
                    
                    // editor.on('NodeChange', this.editorInput)
                    // editor.on('Paste Change input Undo Redo', function(e) {
                    //     console.log(e)
                    // })
                    editor.on('Paste Change input Undo Redo', editorChange)
                },

                ///// Waiting for bugfix https://github.com/tinymce/tinymce/issues/6321
                // setup: function (editor) {
                //     editor.ui.registry.addContextToolbar('textselection', {
                //         predicate: function (node) {
                //             return !editor.selection.isCollapsed() && node.nodeName.toLowerCase() !== 'img'
                //         },
                //         items: 'bold italic underline strikethrough | backcolor',
                //         position: 'selection',
                //         scope: 'node'
                //     });
                // },
            
            
            },
        }
        
    },

    methods: {
        saveContent() {
            let newContent = JSON.parse ( JSON.stringify ( this.content[0] ) )
        
            newContent.text.text = this.localText

            this.$emit('programUpdatedContent', this.$options._componentTag, newContent)

        },

        imageUploadHandler(blobInfo, success, failure) {
            let data = new FormData();
            data.append("file", blobInfo.blob(), blobInfo.filename()) 
            this.$http
                .post("/api/files", data)
                .then(function (res) {
                console.log(res)
                success(res.data.file.url)
                })
                .catch(function (err) {
                console.log(err)
                failure("HTTP Error: " + err.message)
                });
            },

        editorChange() {
            if (this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.saveContent()
            }, 5000);
        }
    },
    
    watch: {
        cardUnload(n) {
            if (n === true) {
                if (this.timeout) {
                    this.saveContent()
                    clearTimeout(this.timeout)
                }
            }
        }
    }
};
</script>

<style>

.tox .tox-tbtn--bespoke .tox-tbtn__select-label {
    width: 3em !important;
}
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
    /* overflow: hidden; */
    /* padding-top: 10px; */
    /* height: 100%; */

    /* overflow-y: scroll; */
}

.text-editor-toolbar {
}

.text-editor-container {
    -webkit-user-select: text;
    height: 100%;
}

.ql-container.ql-snow {
    border: none !important;
}
.ql-snow.ql-toolbar button {
    /* height: 28px !important; */
}

.ql-snow .ql-picker {
    /* font-size: 18px !important; */
    height: 30px !important;
    padding-top: 3px;
}


</style>
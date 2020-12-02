                            @programUpdatedContent="programUpdatedContent"
                            @programCreatedContent="programCreatedContent"
                            @programDeletedContent="programDeletedContent"
                            :isEditing="listItemIsEditing(item.id)"

                            
<template>
    <div class="list-container"
            @drop.prevent="dropUrl($event)"
            @dragover="dragOver($event)"
        >
        <div class="list-items">
            <div class="list-item" v-for="(item, index) in content" :key="index"
                :style="listDynamicStyle">
                <url-item class="list-item-content"
                            :content="item"
                            :hasFocus="hasFocus"
                            @urlItemUpdated="urlItemUpdated"
                            >
                </url-item> 
                
                <div class="list-item-controls">
                    <button
                        class="list-item-controls-common list-item-controls-edit"
                        @click="onListItemControlsEdit(item)"
                    >
                        ✏
                    </button>

                    <button
                        class="list-item-controls-common list-item-controls-delete"
                        @click="deleteUrl(item)"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>

        <div class="list-create-container">
            <button
                @click="createNewUrl"
                
                class="list-create-common list-create-submit"
            >Add url</button>
        </div>
    </div>
</template>

<script>
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
            localContent: JSON.parse(JSON.stringify(this.content))
        }
    },

    computed: {
        listDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        },
        
    },
    
    methods: {
        onListItemControlsEdit(item) {
            let c = this.content.find(c => c.id === item.id)
            let updatedUrl = JSON.parse ( JSON.stringify ( c ) )
            this.setNestedObjectValue(updatedUrl, 'local.update', "terminate")
            
            if(c.local.isEditing === true) {
                this.setNestedObjectValue(updatedUrl, 'local.isEditing', false)
            } else {
                this.setNestedObjectValue(updatedUrl, 'local.isEditing', true)
            }

            this.$emit('programUpdatedContent', 'todo-list', updatedUrl)
            

            
        },


        urlItemUpdated(updatedUrl) {
            
            this.$emit('programUpdatedContent', 'url-list', updatedUrl)

        },

        createNewUrl() {
            // console.log(programName, updateFunction, updatedContent)
            
            this.$emit('programCreatedContent', 'url-list')

        },

        deleteUrl(deletedUrl) {
            this.$emit('programDeletedContent', 'url-list', deletedUrl)
        },

        dropUrl(event) {
            if (event.dataTransfer.types.includes("text/uri-list")) {
                // console.log(event.dataTransfer.getData("text/uri-list"))
                // this.$emit('urlSubmitted', event.dataTransfer.getData("text/uri-list"))
                this.$emit('programCreatedContent', 'url-list', event.dataTransfer.getData("text/uri-list"))

            }
        },
        
        dragOver(event) {
            event.preventDefault();
            
        },
    }
        
}
</script>

<style>

</style>
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
            <div class="list-item" v-for="(item) in content" :key="item.id"
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

            if(this.content.find(c => c.id === item.id).isEditing === true) {
                this.content.find(c => c.id === item.id).isEditing = false
            } else {
                this.content.find(c => c.id === item.id).isEditing = true
            }
            

            
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
.list-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    /* overflow-y: scroll; */
    overflow-y:auto;

}

.list-items {
    display: flex;
    flex-direction: column;
}

.list-item {
    display: flex;
    flex-direction: row;
    min-height: 60px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    /* width: 100%; */
}

.list-item-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-left: 15px;
    margin-right: 15px;
    /* margin-right: 25px; */
    overflow: hidden;
}

.list-item-controls {
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    /* flex-wrap: nowrap; */
    /* overflow: hidden; */
    

}

.list-item-controls-common {
    /* margin-left: 15px; */
    /* font-size: 20px;
    padding-left: 10px;
    padding-right: 10px; */
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 20px;
    background-color: white;
    border-radius: 99px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

.list-item-controls-edit:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;

}

.list-item-controls-delete {
    margin-left: 15px;
}

.list-item-controls-delete:hover {
    box-shadow: 0 0 0pt 2pt red;

}

.list-create-container {
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
}

.list-create-common {
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 20px;
    background-color: white;
    border-radius: 99px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

.list-create-common:hover {
    /* border: 1px lightgreen solid; */
    box-shadow: 0 0 0pt 2pt lightgreen;

}
</style>
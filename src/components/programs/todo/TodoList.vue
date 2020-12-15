                            @programUpdatedContent="programUpdatedContent"
                            @programCreatedContent="programCreatedContent"
                            @programDeletedContent="programDeletedContent"
                            :isEditing="listItemIsEditing(item.id)"

                            
<template>
    <div class="list-container">
        <div class="list-items">
            <div class="list-item" v-for="(item, index) in content" :key="index"
                :style="listDynamicStyle">
                <todo-item class="list-item-content"
                            :content="item"
                            :hasFocus="hasFocus"
                            :key='index'
                            @todoItemUpdated="todoItemUpdated"
                            >
                </todo-item> 
                
                <div class="list-item-controls">
                    <button
                        class="list-item-controls-common list-item-controls-edit"
                        @click="onListItemControlsEdit(item)"
                    >
                        ✏
                    </button>

                    <button
                        class="list-item-controls-common list-item-controls-delete"
                        @click="deleteTodo(item)"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>

        <div class="list-create-container">
            <button
                @click="createNewTodo"
                
                class="list-create-common list-create-submit"
            >Add todo</button>
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
            let child = this.$children.find(ch => ch.content.id === item.id)
            console.log(child)
            let updatedTodo = JSON.parse ( JSON.stringify ( c ) )
            this.setNestedObjectValue(updatedTodo, 'local.update', "terminate")
                if (c.local.isEditing === true) {
                    this.setNestedObjectValue(updatedTodo, 'local.isEditing', false)
                } else {
                    // if (!child.$refs.input)
                    this.setNestedObjectValue(updatedTodo, 'local.isEditing', true)                        

                }
                this.$emit('programUpdatedContent', 'todo-list', updatedTodo)

            // this.setNestedObjectValue(updatedTodo, 'local.isEditing', true)
            

            

            
        },


        todoItemUpdated(updatedTodo) {
            
            this.$emit('programUpdatedContent', 'todo-list', updatedTodo)

        },

        createNewTodo() {
            // console.log(programName, updateFunction, updatedContent)
            
            this.$emit('programCreatedContent', 'todo-list')

        },

        deleteTodo(deletedTodo) {
            this.$emit('programDeletedContent', 'todo-list', deletedTodo)
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
    min-height: 40px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    /* width: 100%; */
}

.list-item-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-left: 5px;
    margin-right: 15px;
    /* margin-right: 25px; */
    overflow: hidden;
}

.list-item-controls {
    display: flex;
    flex-direction: row;
    margin-right: 5px;
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
    font-size: 16px;
    background-color: white;
    border-radius: 99px;
    padding-left: 10px;
    padding-right: 10px;
    /* padding-top: 5px; */
    /* padding-bottom: 5px; */
    box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    transition: background-color 0.4s,
                box-shadow 0.1s;
    cursor: pointer;
}

.list-item-controls-edit:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;

}

.list-item-controls-delete {
    margin-left: 10px;
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
    font-size: 14px;
    background-color: white;
    border-radius: 99px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;

    cursor: pointer;
}

.list-create-common:hover {
    /* border: 1px lightgreen solid; */
    box-shadow: 0 0 0pt 2pt lightgreen;

}
</style>
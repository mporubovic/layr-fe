:disabled="!todoInput.replace(/ /g, '')"
:disabled="!todo.isEditing"
<template>
    <div class="todo-list-container">
        <div class="todo-list-items" ref="todoList">
            <div class="todo-list-item" v-for="(todo, i) in content" :key="i"
                :style="todoListDynamicStyle">
                <!-- <input type="checkbox" v-model="todo.completed_at"> -->
                <div class="todo-list-item-inputs">
                    <div class="todo-list-item-checkbox">
                        <input
                            @change="checkboxInteraction(todo, $event)"
                            type="checkbox"
                            class="todo-list-item-checkbox-input"
                            id="checkbox"
                            :checked="todo.todo.completed_at ? true : false"
                        />
                        <!-- <span class="todo-list-item-checkbox-checkmark"></span> -->
                    </div>
                    <!-- <input type="checkbox"> -->
                    <!-- <input name="Website" type="checkbox" value="Website" /> -->

                    <input
                        @blur="onTodoListItemInputBlur(todo, $event)"
                        @keydown.enter="onTodoListItemInputKeydownEnter($event)"
                        @input="onTodoListItemInputChange(todo, $event)"
                        class="todo-list-item-input"
                        type="text"
                        v-bind:value="todo.todo.body"
                        :ref="'input-' + todo.id"
                        >
                        
                </div>

                <!-- <span contenteditable="true" class="todo-list-item-input">Type here...</span> -->
                <div class="todo-list-item-controls">
                    <button
                        class="todo-list-item-controls-common todo-list-item-controls-edit"
                        @click="todo.isEditing = !todo.isEditing"
                    >
                        <span class="material-icons">✏</span>
                    </button>

                    <button
                        class="todo-list-item-controls-common todo-list-item-controls-delete"
                        @click="content.splice(i, 1)"
                    >
                        <span class="material-icons">✕</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="todo-list-create-container">
            <!-- <input
                @keydown.enter="addItem"
                v-model="todoInput"
                type="text"
                class="todo-list-create-input"
            /> -->
            <button
                @click="addTodo"
                
                class="todo-list-create-common todo-list-create-submit"
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
            todoInput: "New todo",
        };
    },

    computed: {
        todoListDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        }
    },

    methods: {
        addTodo() {
            let newTodo = {
                todo: {
                    body: this.todoInput
                }
            }
            // this.content.push({
            //     todo: {
            //         body: this.todoInput,
            //         completed_at: null,
            //     },
                
            // });

            // console.log(this.todoInput)
            // this.todoInput = "";

            this.$nextTick(() => {
                const list = this.$refs.todoList;
                list.scrollTop = list.scrollHeight;
            });

            this.$emit('programUpdatedContent', this.$options._componentTag, 'create', newTodo)
        },
        
        updateTodoContent(todo) {
            // todo.isEditing = false
            // todo.todo.body = event.target.value
            this.$emit('programUpdatedContent', this.$options._componentTag, 'update', todo)
        },

        onTodoListItemInputBlur(t, event) {
            let updatedTodo = JSON.parse ( JSON.stringify ( t) )

            updatedTodo.todo.body = event.target.value
            
            this.updateTodoContent(updatedTodo)
        },

        onTodoListItemInputChange(t, event) {
            let updatedTodo = JSON.parse ( JSON.stringify ( t) )

            updatedTodo.todo.body = event.target.value
            
            this.updateTodoContent(updatedTodo)
        },
        
        onTodoListItemInputKeydownEnter(event) {
            // let inputId = 'input-'+todo.id
            // this.$refs[inputId][0].blur()
            event.target.blur()
        },

        checkboxInteraction(t, event) {
            // let todo = this.content.find(todo => todo.todo.id === id)
            let completed = event.target.checked
            let updatedTodo = JSON.parse ( JSON.stringify ( t) )
            let completedAt = null
            
            if (completed) {
                let d = new Date
                completedAt = [d.getFullYear(),
                    d.getMonth()+1, 
                    d.getDate()
                    ].join('-')
                    +
                    ' '
                    +
                    [d.getHours(),
                    d.getMinutes(),
                    d.getSeconds()].join(':');
            }
            // console.log(t, updatedTodo)
            updatedTodo.todo.completed_at = completedAt
            // console.log(t, updatedTodo)

            // this.content.find(t => t.id === todo.id).todo.completed_at = completedAt
            // console.log(this)
            this.updateTodoContent(updatedTodo);


        }
        
        
    },
};
</script>

<style>
.todo-list-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    /* overflow-y: scroll; */
    overflow-y:auto;

}

.todo-list-items {
    display: flex;
    flex-direction: column;
}

.todo-list-item {
    display: flex;
    flex-direction: row;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    /* width: 100%; */
}

.todo-list-item-inputs {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-left: 10px;
    /* height: 100%; */
    /* margin-right: 15px; */
    /* width: 100%; */
    /* max-width: 100%; */
}

.todo-list-item-checkbox {
    /* height: 100%; */
}

.todo-list-item-checkbox-input {
    /* appearance: none; */
    height: 25px;
    width: 25px;
    outline: 1px solid black;

}

.todo-list-item-checkbox-checkmark {
    /* width: 30px;
    height: 30px;
    display: block;
    margin-bottom: 20px;
    margin-left: 20px;
    font: 14px/20px "Open Sans", Arial, sans-serif;
    color: #ddd;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none; */
}


.input[type="checkbox"] + label:last-child {
    margin-bottom: 0;
}

.input[type="checkbox"] + label:before {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    border: 1px solid #6cc0e5;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.6;
    -webkit-transition: all 0.12s, border-color 0.08s;
    transition: all 0.12s, border-color 0.08s;
}

.input[type="checkbox"]:checked + label:before {
    width: 10px;
    top: -5px;
    left: 5px;
    border-radius: 0;
    opacity: 1;
    border-top-color: transparent;
    border-left-color: transparent;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}

.todo-list-item-input {
    margin-left: 25px;
    /* width: auto; */
    /* margin-right: 15px; */
    font-size: 20px;
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    /* max-width: auto; */

    /* max-width: 2000px;  */

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 25px;
    transition: all 0.3s;
}

.todo-list-item-input:focus {
    border: 1px solid black;
    font-style: italic;
}

.todo-list-item-input:hover:not(:focus) {
    /* border: 1px solid black; */
    font-style: italic;
    

}


.todo-list-item-controls {
    display: flex;
    flex-direction: row;
    margin-right: 10px;
}

.todo-list-item-controls-common {
    margin-left: 15px;
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
}

.todo-list-create-container {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
}

.todo-list-create-common {
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid black;
}
</style>

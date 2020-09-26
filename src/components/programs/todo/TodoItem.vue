:disabled="!todoInput.replace(/ /g, '')"
:disabled="!todo.isEditing"

                        @blur="onTodoInputBlur(todo, $event)"
                        @keydown.enter="onTodoInputKeydownEnter($event)"
<template>
    <div class="todo-item-container">
            <input
                @change="checkboxInteraction($event)"
                type="checkbox"
                class="todo-item-checkbox"
                id="checkbox"
                :checked="content.todo.completed_at ? true : false"
            />

            <input
                @blur="onTodoInputBlur($event)"
                @keydown.enter="onTodoInputKeydownEnter($event)"
                class="todo-item-input"
                type="text"
                v-bind:value="content.todo.body"
                id="todo-input"
                ref="input"
                v-if="content.local.isEditing"
                autocomplete="off" 
                >
                
            <div class="todo-item-body" @contextmenu.prevent="bodyContextmenu()"
                    >
                <p
                    v-if="!content.local.isEditing"
                    
                    >
                    {{ content.todo.body }}
                </p>
            </div>
            

            
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Object,
            required: true,
        },
        
        hasFocus: {
            type: Boolean,
            required: true,
        },
    },

    data() {
        return {
            todoInput: "New todo",
        };
    },

    computed: {
        todoListDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        },

        isEditing() {
            return this.content.local.isEditing
        }
    },

    methods: {
        
        updateTodoContent(todo) {
            // todo.isEditing = false
            // todo.todo.body = event.target.value
            this.$emit('todoItemUpdated', todo)
        },


        onTodoInputBlur(event) {
            let updatedTodo = JSON.parse ( JSON.stringify ( this.content ) )

            updatedTodo.todo.body = event.target.value
            this.setNestedObjectValue(updatedTodo, 'local.isEditing', false)
            this.setNestedObjectValue(updatedTodo, 'local.update', "continue")
            // updatedTodo.local.isEditing = false
            // updatedTodo.local.update = true
            
            this.updateTodoContent(updatedTodo)
            // this.content.isEditing = false

        },
        
        onTodoInputKeydownEnter(event) {
            // let inputId = 'input-'+todo.id
            // this.$refs[inputId][0].blur()
            event.target.blur()
        },

        checkboxInteraction(event) {
            // let todo = this.content.find(todo => todo.todo.id === id)
            let completed = event.target.checked
            let updatedTodo = JSON.parse ( JSON.stringify ( this.content ) )
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


        },

        bodyContextmenu() {
            // this.content.isEditing = true

            let updatedTodo = JSON.parse ( JSON.stringify ( this.content ) )

            this.setNestedObjectValue(updatedTodo, 'local.update', "terminate")
            this.setNestedObjectValue(updatedTodo, 'local.isEditing', true)
            
            this.updateTodoContent(updatedTodo)

            // this.$nextTick(() => {
            //     this.$el.querySelector("#todo-input").focus()
            // })

        },
        
        
    },

    watch: {
        'content.local.isEditing': {
            handler(n) {
                if (n) {
                    this.$nextTick(() => {
                        this.$el.querySelector("#todo-input").focus()
                    })
                }
            }
            
        }
    },
};
</script>

<style>
.todo-item-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
    /* overflow-y: scroll; */
    overflow-y:auto;

}


.todo-item-checkbox {
    /* height: 100%; */
    height: 35px;
    min-width: 35px;
    /* min-width: 100%; */
    margin-right: 25px;

}

.todo-item-input {
    margin-right: 35px;

    /* width: auto; */
    /* margin-right: 15px; */
    font-size: 20px;
    width: 100%;
    /* padding-left: 10px; */
    box-sizing: border-box;
    border-bottom: 1px solid black;
    font-style: italic;

    /* max-width: auto; */

    /* max-width: 2000px;  */

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* margin-right: 25px; */
    transition: all 0.3s;
}

.todo-item-body {
    /* font-size: 20px; */
    /* width: 100%; */
    /* padding-left: 10px; */
    /* margin-right: 25px; */

    /* box-sizing: border-box; */
    /* border-bottom: 1px solid black; */
    /* max-width: auto; */

    /* max-width: 2000px;  */
    /* font-weight: bold; */
    /* cursor:pointer; */

    overflow: hidden;
    /* white-space: nowrap; */
    /* text-overflow: ellipsis; */
    /* margin-right: 25px; */
    transition: all 0.3s;
    /* text-decoration: none; */
    /* color: blue; */
}

.todo-item-body p {
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

</style>

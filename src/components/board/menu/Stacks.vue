                    :style="'margin-top: '+  (index-1)*30 + 'px'"
<template>
    <div class="stacks">
        <div class="stacks-menu" v-if="createStack">
            <button id="new-stack-button" @click="newStack">
                
                <img src="@/assets/common/addcirclewhite.svg">
                <p>Add stack</p>
            </button>
        </div>
        <div class="carousel-container">

            <div class="carousel-stack" 
                v-for="stack in stacks.filter(s=>s).sort(function(a, b) {
                                            let ta = new Date(a.info.updated_at)
                                            let tb = new Date(b.info.updated_at)
                                            return tb.getTime() - ta.getTime()
                                        })"
                :key="'stack-'+stack.info.id"
                @click="stackClicked(stack.info.id)"
                >

                <div class="carousel-stack-icon">
                    <div class="carousel-board-icon" v-for="index in boardIcons" :key="index"
                        :style="{marginBottom: ((index-1)*20) + 'px', backgroundColor: randomColor()}"
                    >

                    </div>
                </div>

                <div class="item-title" :style="{'border': '3px solid '+ randomColor()}" @click.right.prevent="onStackTitleRightClick(stack.info.id)" >
                    <p v-if="stackEditingId !== stack.info.id">{{ stack.info.title }}</p>
                    <input
                        @blur="stackChangeTitle($event.target.value, stack.info.id)"
                        @keydown.enter="onStackTitleInputEnter($event, stack.info.id)"
                        class="stack-title-input"
                        type="text"
                        :id="'stack-title-input-'+stack.info.id"
                        v-bind:value="stack.info.title"
                        v-if="stackEditingId === stack.info.id"
                        autocomplete="off" 
                    >
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    // name: 'menu-stacks'
    props: {
        stacks: {
            // required: true,
            // type: [Array, Null]
        },
        createStack: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            boardIcons: 3,
            stackEditingId: null,
        }
    },

    methods: {
        stackClicked(id) {
            if (!this.stackEditingId) {
                this.$emit('subMenuStackClicked', id)
                document.querySelector('#dropzone-grid').style.outline = "solid 3px rgba(235, 235, 235, 0.2)"
            } 
        },

        newStack() {
            this.$emit('subMenuStackNewStack')
        },

        randomColor() {
            let r = 150 + Math.floor(Math.random() * 150)
            let g = 150 + Math.floor(Math.random() * 150)
            let b = 150 + Math.floor(Math.random() * 150)
            let color = `rgb(${r}, ${g}, ${b})`

            return color
        },

        onStackTitleInputEnter(event) {
            if (event.target.value.length === 0) return
            event.target.blur()
            // this.stackEditingId = id
        },

        stackChangeTitle(title, id) {
            if (event.target.value.length === 0) return
            this.stackEditingId = null
            let stack = this.stacks.find(s=>s.info.id === id)
            stack.info.title = title
            this.$emit('stackUpdatedItself', id, 'info.title', title)
        },

        onStackTitleRightClick(id) {
            this.stackEditingId = id
            this.$nextTick(() => {
                this.$el.querySelector('#stack-title-input-'+id).focus()
            })
        },

    },


}
</script>
<style>
.stacks {
    position: relative;
    height: 500px;

}

.carousel-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.stacks-menu {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
}

#new-stack-button {
    overflow: hidden;
    font-size: 16px;
    /* margin-top: 10px; */
    text-align: center;
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 3px solid white;
    color: white;
    margin-bottom: 20px;
    cursor: pointer;
}

#new-stack-button img {
    height: 20px;
}

#new-stack-button p {
    margin-left: 10px;
}


.carousel-stack-icon {
    border-radius: 7px;
    height: 90px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    /* flex-direction: column; */
}

.carousel-board-icon {
    width: 70px;
    min-height: 50px;
    background-color: white;
    /* transform: rotate3d(-41, 14, 15, 50deg) rotateX(15deg); */
    transform: rotate3d(-32, 11, 19, 69deg) rotateX(18deg);
    border-radius: 5px;
    position: absolute;
    bottom: 0;
    opacity: 0.95;
}


.carousel-stack {
    min-width: 170px;
    /* max-width: 170px; */
    padding: 2px;
    /* margin-left: 8px; */
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 25px;
}

/* .item-title {
    overflow: hidden;
    color: white;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgba(0, 0, 0, 0.25);
} */

.stack-title-input {
    font-size: 16px;
    font-weight: bold;
    font-style: italic;
    /* width: 100%; */
    /* margin-left: 10px; */
    text-align: center;
    color: white;
    background-color: transparent;
}
</style>

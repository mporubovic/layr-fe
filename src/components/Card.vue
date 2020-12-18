        @mouseup="onCardMouseUp"
        @mousemove="onCardMouseMove"
        @mousedown="isInStack ? onCardMouseDown : null"
@mouseup="onCardMouseUp"
@mousedown="isInStack ? onCardMouseDown() : null"

                @mousedown="isInStack ? onCardMouseDown() : null"
                @mouseover="onCardHeaderMouseOver"
                @mouseleave="onCardHeaderMouseLeave"
                @mouseover="onCardHeaderMouseDown"
                        :contentComponent="cardContentComponentName(card)"


                
<template>
    <div class="card card-transitions" 
        :ref="'card' + id"  
        key="id"
        :id="'card-'+id"
        >

        <div class="card-header"
            >
            <div class="card-header-title card-header-drag-handle"
                    >
                <img class="card-icon-onboard" 
                    v-if="loadContent"
                    :src="card.local.display.icon">
                
                <h1 @click.right.prevent="onCardHeaderRightclick()"
                        v-if="!isHeaderEditing">{{ card.info.title }}</h1>
                <input
                    @blur="cardUpdateProperty('info.title', $event.target.value)"
                    @keydown.enter="onCardHeaderInputKeydownEnter($event)"
                    class="card-header-title-input"
                    type="text"
                    id="title-input"
                    v-bind:value="card.info.title"
                    v-if="isHeaderEditing"
                    autocomplete="off" 
                    >
            </div>

            <div class="card-header-controls">
                
                <div class="card-header-controls-delete"
                        @mouseup="deleteCard()"
                        >
                    <img src="@/assets/common/delete.svg"
                            :style="deleteButtonDynamicStyle">
                </div>
            </div>
            
        </div>

        <div class="card-body card-body-resize-handle" id="card-body"
                @mouseover="onCardBodyMouseOver"
                @mouseleave="onCardBodyMouseLeave"
                >

            <!-- <div class="test">

            </div> -->
            
            <img class="card-icon-instack" 
                    v-if="!loadContent"
                    :src="card.local.display.icon">

            <!-- <h1 v-if="loadContent">{{ card.display.position }}</h1> -->

            <component v-if="loadContent"
                        class="card-component"
                        :is="cardProgram(card)" 
                        :content="cardContent"
                        :cardId="card.info.id"
                        :hasFocus="hasFocus"
                        :cardUnload="boardUnload"
                        @programUpdatedContent="programUpdatedContent"
                        @programCreatedContent="programCreatedContent"
                        @programDeletedContent="programDeletedContent"
                        :autoSaveInterval="5000"
                        :cardRect="boundingRect"
                        >
            </component>        

            
            <!-- <slot v-if="loadContent()"
                    :style="cardBodyDynamicStyle"
                    >
            </slot>  -->
            
            <!-- <h1>ix {{ index }}</h1>
            <h2>id {{ id }}</h2> -->
            <!-- <h1 v-if="isInStack">I {{ index }}</h1> -->
            <!-- <h2 style="font-size: 60px; margin-left: 10px;" v-if="isInStack">{{ card.info.type }}</h2> -->

        
        </div>




    </div>
        
</template>

<script>
export default {
    
    props: {
        card: {
            type: Object,
            required: true,
        },
        hasFocus: {
            type: Boolean,
            required: true
        },

        boardUnload: {
            type: Boolean
        },
    },

    data() {
        return {
            isHovering: false,
            boundingRect: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            },

            boardPosition: {
                x: null,
                y: null,
            },

            mouseDown: false,


            headerTapCount: 0,

            deleteTapCount: 0,
            // index: this.card.display.position,

            isHeaderEditing: false,

            headerTimer: null,

            loadContent: false,

            newColumn: null,
            newRow: null,

        }
    },
    
   
    computed: {

        id() {
            return this.card.info.id  
        },

        dimensions() {
            return this.card.settings.dimensions
        },

        cardContent() {
            // this.card.content
            return (this.card.content) ? this.card.content : []
        },

        deleteButtonDynamicStyle() {
            return this.deleteTapCount > 0 ? {'opacity': "1"} : {'opacity': "0.2"}
        },

        overlap() {
            this.card.local
            return this.card.local.overlap
        }

    },
    
    mounted() {
        this.calcBoundingRect();
        this.loadContent = true
    },

    beforeDestroy() {
        this.$el.remove()
    },

    created() {
        window.addEventListener("resize", this.calcBoundingRect);
    },

    destroyed() {
        window.removeEventListener("resize", this.calcBoundingRect);
    },

    methods: {
        cardProgram(card) {
            switch (card.info.type) {
                
                case("image") :
                    
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "rgba(0,0,0,0.15)";

                    }, 0);
                    
                    return "image-viewer";  
                    
                case("video") :
                    return "VideoViewer";                
                
                case("pdf") :
                    this.$el.querySelector(".card-body").style.padding = "15px 15px 15px 15px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "#D1D1D1";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "#D1D1D1";

                    return "pdf-viewer";                
                
                case("todo") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "white";
                    }, 0);
                    return "todo-list";                
                
                case("url") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "white";
                    }, 0);
                    return "url-list";     
                    
                case("text") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "white";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "white";

                    return "text-editor";  

                case("youtube") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "rgba(0, 0, 0, 0.5)";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "white";
                    return "youtube-player"; 

                case("whiteboard") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "rgba(0, 0, 0, 0.5)";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "white";
                    return "whiteboard"; 

                     
            }
        },

        
        calcBoundingRect() {
            let br = this.$el.getBoundingClientRect()
            this.boundingRect.left = br.left;
            this.boundingRect.top = br.top;
            this.boundingRect.width = br.width;
            this.boundingRect.height = br.height;
        },
        

        onCardMouseMove() {
        },

        onCardBodyMouseOver() {
            // this.$el.style.cursor = "grab";

        },

        onCardBodyMouseLeave() {
            this.$el.style.cursor = "";
            // this.$children[0].$el.style["pointer-events"] = 'none'
        },

        onCardHeaderMouseOver() {
            this.$el.style.cursor = "grab";
        },
        
        onCardHeaderMouseLeave() {
            this.$el.style.cursor = "";
        },


        onCardHeaderRightclick() {
            this.isHeaderEditing = true
            this.$nextTick(() => {
                this.$el.querySelector('#title-input').focus()
            })
        },

        cardUpdateProperty(path, value) {
            this.isHeaderEditing = false
            this.$emit('cardUpdatedItself', this.id, path, value)
        },



        onCardHeaderInputKeydownEnter(event) {
            event.target.blur()
            this.isHeaderEditing = false
        },

        programUpdatedContent(programName, updatedContent) {
            // console.log(programName, updateFunction, updatedContent)
            this.$emit('cardProgramUpdatedContent', programName, updatedContent, this.id)

        },

        programCreatedContent(programName, mainContent) {
            // console.log(programName, updateFunction, updatedContent)
            this.$emit('cardProgramCreatedContent', programName, mainContent ?? null, this.id)

        },

        programDeletedContent(programName, deletedContent) {
            this.$emit('cardProgramDeletedContent', programName, deletedContent, this.id)
        },

        deleteCard() {
            this.deleteTapCount++
            // console.log(this.headerTapCount)
            
            // this.timer ? clearTimeout(this.timer) : this.timer = setTimeout(() => { this.headerTapCount = 0 }, 700);

            setTimeout(() => {
                if (this.deleteTapCount > 1) {
                    // this.$emit('cardBringForward', this.card.info.id);
                    // console.log('DLETE CARD')
                    this.cardUpdateProperty('local.delete', 'true')



                } 
                this.deleteTapCount = 0

            }, 600);
        },

        cardResized() {
            this.calcBoundingRect()
        },
    },
}
</script>


<style>
.card-component {
    height: 100%;
}

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    /* width: 100%; */
    max-height: 30px;
    /* opacity: 0;  */
    background-color: white;
    /* outline: 1px black solid; */
    border-bottom: 2px black solid;

}

.card-header-controls {
    color: black;
    font-size: 25px;
    /* padding-right: 15px; */
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    /* justify-content: center; */
    /* align-items: center; */
}

.card-header-controls-delete {
    /* margin-right: 11px; */
    /* opacity: 0.4; */
    cursor: pointer;
    /* margin-top: 5px; */
}

.card-header-controls-delete img {
    height: 22px;
    /* margin-top: 5px; */
    color: red;
    fill: red;
    /* background-color: red; */
}

.card-header-title {
    /* padding-left: 10px; */
    flex: 1;
    margin-left: 15px;
    margin-right: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;


}

.card-icon-onboard {
    height: 24px;
    /* margin-right: 10px; */
}

.card-header-title h1 {
    font-size: 18px;
    margin-left: 10px;
    color: black;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.card-header-title-input {
    font-size: 18px;
    font-weight: bold;
    font-style: italic;
    width: 100%;
    margin-left: 10px;
}

.card-body {
    margin: 0;
    /* height: 100%; */
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y:hidden;
    overflow-x: hidden;
    touch-action: none;
    overflow: hidden;
    
}


.card-body p {
    font-size: 16px;
    margin: 0px;
    color: black;
}

.card-body h1 {
    font-size: 85px;
    margin: 0px;
    /* padding: 0px; */
    color: black;
}


.card {
    position: relative;
    user-select: none;
    opacity: 1;
    touch-action: none;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    /* box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.75); */
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.card-corner {
    position: absolute;
    /* position: relative; */
    bottom: 0;
    right: 0;
    background-color:rgba(0, 0, 0, 0.1);
    width: 20px;
    height: 20px;
    z-index: 20;
}

.card-transitions {
    transition: 
                transform 0.20s ease-in-out,
                width 0.20s ease-in-out,
                height 0.20s ease-in-out,
                opacity 0.20s ease-in-out,
                ;
}

.card-semitransparent {
    opacity: 0.3;
    z-index: 9999;
}

.card-on-board {
    position: absolute;
    transform: none;
    /* opacity: 1; */
}
</style>
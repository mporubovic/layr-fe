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
    <div class="card card-in-stack" 
        :ref="'card' + id"  
        key="id"
        :style="cardDynamicStyle"
        @mouseover="onCardMouseOver"
        @mouseleave="onCardMouseLeave"
        >
        
        <div class="card-header"
                @mousedown="onCardHeaderMouseDown()"
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


                <div class="card-header-controls-close"
                        @mouseup="isInStack ? null : onCardMouseUp()"
                        >
                    ✕
                </div>
            </div>
            
        </div>

        <div class="card-body card-body-resize-handle" id="card-body"
                @mousedown="isInStack ? onCardMouseDown() : cardChildPointerEvents()"
                @mouseup="isInStack ? onCardMouseUp() : null"
                @mouseover="onCardBodyMouseOver"
                @mouseleave="onCardBodyMouseLeave"
                :style="cardBodyDynamicStyle"
                >

            <!-- <div class="test">

            </div> -->
            
            <img class="card-icon-instack" 
                    v-if="!loadContent"
                    :src="card.local.display.icon">

            <!-- <h1 v-if="loadContent">{{ card.display.position }}</h1> -->

            <component v-if="loadContent"
                        :is="cardProgram(card)" 
                        :content="cardContent"
                        :cardId="card.info.id"
                        :hasFocus="hasFocus"
                        @programUpdatedContent="programUpdatedContent"
                        @programCreatedContent="programCreatedContent"
                        @programDeletedContent="programDeletedContent"
                        :autoSaveInterval="stackSettings.autoSaveInterval"
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
import interact from 'interactjs';
// import { nextTick } from 'vue/types/umd';

export default {
    
    // props: ['card', 'index'],
    props: {
        card: {
            type: Object,
            required: true,
        },
        // index: {
        //     type: Number,
        //     required: true, 
        // },
        stackSettings: {
            type: Object,
            required: true, 
        },
        hasFocus: {
            type: Boolean,
            required: true
        }
    },

    data() {
        return {
            isHovering: false,
            boundingRect: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },

            stackBoundingRect: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },

            // stackPosition: 0,

            boardPosition: {
                x: null,
                y: null,
            },

            // dimensions: this.card.display.dimensions,

            // isInStack: true,
            mouseDown: false,


            // id: this.card.info.id,

            // hasFocus: false,

            headerTapCount: 0,

            deleteTapCount: 0,

            // index: this.index,
            // index: this.card.display.position,

            isHeaderEditing: false,

            headerTimer: null,

            loadContent: false,

        }
    },
    
   
    computed: {
        cardDynamicStyle() {
            
                return this.isInStack ? { 'z-index': this.index} : {'z-index': this.index};

        },

        cardBodyDynamicStyle() {
            return this.isInStack ? {'background-color': "white"} : null
        },

        // loadContent() {
        //     return !this.isInStack;
        // }

        id() {
            return this.card.info.id  
        },

        dimensions() {
            return this.card.settings.dimensions
        },

        isInStack() {
            return !this.card.display.open
        },

        index() {
            return this.card.display.position
        },

        stackPosition() {
            return this.card.local.display.stackPosition
            // return this.card.local ? this.card.local.display.stackPosition : this.index
        },

        cardContent() {
            // this.card.content
            return (this.card.content) ? this.card.content : []
        },

        deleteButtonDynamicStyle() {
            return this.deleteTapCount > 0 ? {'opacity': "1"} : {'opacity': "0.2"}
        }

    },
    
    mounted() {
        this.calcBoundingRect();
        // this.stackPosition = (this.index -1 );
        // this.stackPosition = (this.index);
        // this.$el.style.bottom = this.index * this.stackSettings.cardGap + 'px'
        this.$el.style.bottom = this.stackPosition * this.stackSettings.cardGap + 'px'
        this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg) scale(0.8)";
        // console.log(this.stackPosition)
    
        // let r = Math.floor(Math.random()* 254) ;
        // let g = Math.floor(Math.random()* 254) ;
        // let b = Math.floor(Math.random()* 254) ;
        // let a = 0.9;
        // // alert('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
        // this.$el.style["background-color"] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

        this.initializeInteractJsResizable();
        this.initializeInteractJsDraggable();

        if (!this.isInStack) this.cardToBoard()
        // if (!this.isInStack) {
        //     setTimeout(() => {
        //         this.cardToBoard()
        //     }, 100 + 100*this.index);
        // }


        // this.$el.classList.remove();
 
    },

    beforeDestroy() {
        if (!this.card.local.delete) this.cardUpdateProperty('local.display.stackPosition', this.index)
        // this.cardUpdateProperty('display.', this.index)
        this.$el.remove()

    },

    methods: {
        cardProgram(card) {
            switch (card.info.type) {
                
                case("image") :
                    
                    switch (card.settings.program) {
                        case "gallery":
                            setTimeout(() => {
                                this.$el.querySelector(".card-body").style["background-color"] = "rgba(0,0,0,0.15)";

                            }, 0);
                            
                            return "image-viewer";  
                    }
                break
 
                    
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

                     
            }
        },


        
        startupAnimation () {
            this.onCardMouseDown();
        },
        
        calcBoundingRect() {
            let cid = 'card' + this.id;
            let br = this.$refs[cid].getBoundingClientRect();
            this.boundingRect.x = br.x;
            this.boundingRect.y = br.y;
            this.boundingRect.width = br.width;
            this.boundingRect.height = br.height;
        },

        onCardMouseOver() {
            this.isHovering = true;
            if (this.isInStack) {
                this.$el.children[0].style.opacity = 1;
                this.$el.style.transform = "";
                this.$el.style.transform += "rotate3d(-41, 14, 15, 50deg) rotateX(15deg) scale(0.8)";
            }

        },
        
        onCardMouseLeave() {
            this.isHovering = false;
            if (this.isInStack) {
                this.$el.children[0].style.opacity = 0;
                this.$el.style.transform = "";
                this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg) scale(0.8)";
            }
            
            // if (!this.isInStack) {
            //     this.hasFocus = false;
            // }
            
            // this.$el.style.transform -= "rotateX(15deg)";

        },

        cardToBoard() {
                // alert('GO TO BOARD');
                // console.log(this.loadContent)
                setTimeout(() => {
                    this.loadContent = true
                    // console.log(this.loadContent)

                }, 1000);

                this.$emit('cardStackInteraction', this.id, true);

                
                this.$el.classList.remove("card-in-stack");
                this.$el.classList.add("card-on-board");
                this.calcBoundingRect();
                
                
                document.getElementById("cards").appendChild(this.$el);
                
                this.$el.style.bottom = "" ;
                this.$el.style.top = this.boundingRect.y + 'px' ;
                this.$el.style.left = this.boundingRect.x + 'px';
                
            

                setTimeout(() => {
                // this.$nextTick(() => {
                    
                    this.$el.style.left = this.dimensions.x + 'px';
                    this.$el.style.top = this.dimensions.y + 'px';

                    this.$el.style.width = this.dimensions.width + 'px';
                    this.$el.style.height = this.dimensions.height + 'px';


                    this.$el.style.opacity = 1;
                    this.$el.children[0].style.opacity = 1;


                    this.$el.style.transform = "";
                }, 50);
                // });

                // setTimeout(() => {
                //     this.loadContent = true
                // }, 1500);

                interact(this.$refs['card'+this.id]).draggable(true).resizable(true);
                
                this.$el.classList.add('draggable');
                this.$el.classList.add('resizable');
                // this.isInStack = false;
                // this.cardUpdateProperty('display.open', true)
        },

        cardToStack() {
                // alert('GO TO STACK');
                this.loadContent = false

                let brStack = this.$parent.calculateBoundingRectangle();
                this.$emit('cardStackInteraction', this.id, false);
                
                
                // this.$el.offsetHeight;
                this.$el.classList.remove("card-on-board");
                this.$el.classList.add("card-in-stack");
                let cid = 'card' + this.id;
                let br = this.$refs[cid].getBoundingClientRect();
                let crd = this.$refs[cid];
                
                crd.setAttribute('data-x', 0);
                crd.setAttribute('data-y', 0);
                
                document.getElementById("stack-cards").appendChild(crd);

                
                
                this.$el.style.transform = "";
                this.$el.style.top = "";
                
                // console.log(brStack);
                this.$el.style.bottom =  (brStack.y - br.y - br.height ) + 'px' ;
                // this.$el.style.bottom =  300 + 'px' ; 
                this.$el.style.left = br.x - brStack.x + 'px' ;
                // this.$el.style.left = brStack.x - br.x + 'px' ;

                crd.style.opacity = 1;

                
                setTimeout(() => {
                    
                    crd.style.bottom = (this.stackPosition * this.stackSettings.cardGap) + 'px';

                    crd.style.left = 0;
                    this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg) scale(0.8)";
                    
                    crd.style.width = this.stackSettings.cardDimensions.width + 'px';
                    crd.style.height = this.stackSettings.cardDimensions.height + 'px';
                    
                    crd.children[0].style.opacity = 0;
                    this.$el.style.opacity = 0.15;

                    this.$el.querySelector(".card-body").style.padding = "";


                    // this.$el.style["background-color"] = "white";

                    // this.loadContent = false


                    
                }, 50);

                this.$el.classList.add("card-in-stack");
                
                // interact('.resizable').resizable(false);
                // interact('.draggable').draggable(false);
                
                interact(this.$refs['card'+this.id]).draggable(false).resizable(false);
                crd.classList.remove('draggable');
                crd.classList.remove('resizable');
                
                
                // this.isInStack = true;
                // this.cardUpdateProperty('display.open', false)
        },

        onCardMouseUp() {
            
            if (this.isInStack) {
                // this.cardToBoard()
                this.cardUpdateProperty('display.open', true)

            } else {
                // this.cardToStack()
                this.cardUpdateProperty('display.open', false)
    
            }

        },

        onCardMouseDown() {
            
            this.$el.style.transform += "translateY(10px)" ;
            if (!this.isInStack) {
                // this.hasFocus = true;
                alert('warn')
            }
                


            
            
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

        onCardHeaderMouseDown() {
            this.headerTapCount++
            // console.log(this.headerTapCount)
            
            // this.timer ? clearTimeout(this.timer) : this.timer = setTimeout(() => { this.headerTapCount = 0 }, 700);

            setTimeout(() => {
                if (this.headerTapCount === 2) {
                    // this.$emit('cardBringForward', this.card.info.id);
                    console.log('forward DISABLED')


                } else if (this.headerTapCount >= 2) {
                    
                    this.isHeaderEditing = true
                    this.$nextTick(() => {
                        this.$el.querySelector('#title-input').focus()
                    })
                    
                    // console.log('editing')
                }

                this.headerTapCount = 0

            }, 400);

            // setTimeout(() => {
            //     if (this.headerTapCount === 2) {
            //         this.$emit('cardBringForward', this);
            //         console.log('forward')


            //     } else if (this.headerTapCount >= 2) {
            //         this.isHeaderEditing = true

            //         console.log('editing')
            //     }

            //     this.headerTapCount = 0

            // }, 200);


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

        setStackPosition(pos) {
            this.stackPosition = pos;
            this.$el.style.bottom = pos * this.stackSettings.cardGap + 'px';
        },
        
        
        dragMoveListener (event) {
            var target = event.target
            // keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)'

            // update the posiion attributes
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            },

        cardChildPointerEvents() {
            // this.hasFocus = true;
            // alert('warning');
            // this.$children[0].$el.style["pointer-events"] = 'all'
            // this.$children[0].$el.style.removeProperty('pointer-events')
        },
            
        initializeInteractJsResizable() {
            let self = this;
            interact(this.$refs['card'+this.id])
                .resizable({
                    enabled: false,
                    // resize from all edges and corners
                    edges: { left: true, right: true, bottom: true, top: false },
                    // margin: 10,
                    allowFrom: '.card-body-resize-handle',
                    ratio: 1,
                    // ratio: 800/526,

                    listeners: {
                        start () {
                            // event = ""
                            self.$emit('cardInteractJsResize', self.id, true)
                        },
                        
                        move (event) {
                            var target = event.target
                            
                            target.classList.add("card-no-delay");
                        
                            
                            
                            
                            var x = (parseFloat(target.getAttribute('data-x')) || 0)
                            var y = (parseFloat(target.getAttribute('data-y')) || 0)

                            // update the element's style
                            target.style.width = event.rect.width + 'px'
                            target.style.height = event.rect.height + 'px'

                            // translate when resizing from top or left edges
                            x += event.deltaRect.left
                            y += event.deltaRect.top

                            target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + y + 'px)'

                            target.setAttribute('data-x', x)
                            target.setAttribute('data-y', y)

                            // console.log(event);
                            // console.log(self.boardPosition.x);
                            // console.log(event.rect.left);
                            
                            // self.dimensions.x = event.rect.left;
                            // self.dimensions.y = event.rect.top;

                            // self.cardUpdateProperty('display.dimensions.x', event.rect.left)
                            // self.cardUpdateProperty('display.dimensions.y', event.rect.top)
                        },

                        end (event) {
                            event.target.classList.remove("card-no-delay");
                            // alert('uwaga');
                            // self.dimensions.width = event.rect.width;
                            // self.dimensions.height = event.rect.height;
                            self.cardUpdateProperty('settings.dimensions.x', Math.round(event.rect.left))
                            self.cardUpdateProperty('settings.dimensions.y', Math.round(event.rect.top))
                            self.cardUpdateProperty('settings.dimensions.width', Math.round(event.rect.width))
                            self.cardUpdateProperty('settings.dimensions.height', Math.round(event.rect.height))
                            self.$emit('cardInteractJsResize', self.id, false)
                            
                        }
                    },
                    modifiers: [
                    // keep the edges inside the parent
                        interact.modifiers.restrictEdges({
                            outer: 'parent'
                        }),

                    // minimum size
                        interact.modifiers.restrictSize({
                            min: { width: 260, height: 150 }
                        }),

                        // interact.modifiers.aspectRatio({ 
                        //     ratio: 481/354,


                        // })
                    ],

                    inertia: true
                })
                
            
        },
        
        initializeInteractJsDraggable() {
            let self = this;

            interact(this.$refs['card'+this.id])
                    .draggable({
                        enabled: false,
                        
                        // enable inertial throwing
                        inertia: true,
                        // keep the element within the area of it's parent
                        modifiers: [
                            interact.modifiers.restrictRect({
                                restriction: 'parent',
                                endOnly: true
                            }),

                        ],
                        // enable autoScroll
                        autoScroll: false,
                        allowFrom: '.card-header-drag-handle',

                        listeners: {
                        // call this function on every dragmove event
                            start () {
                                self.$emit('cardInteractJsDrag', self.id, true)
                            },
                            
                            move (event) {
                                var target = event.target
                                target.classList.add("card-no-delay");
                                
                                // keep the dragged position in the data-x/data-y attributes
                                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                                
                                // translate the element
                                target.style.webkitTransform =
                                    target.style.transform =
                                    'translate(' + x + 'px, ' + y + 'px)'

                                // update the posiion attributes
                                target.setAttribute('data-x', x)
                                target.setAttribute('data-y', y)
                            },

                            // call this function on every dragend event
                            end (event) {
                                event.target.classList.remove("card-no-delay");
                                // console.log(event);
                                // console.log(self.boardPosition.x);
                                // console.log(event.rect.left);
                                // self.dimensions.x = event.rect.left;
                                // self.dimensions.y = event.rect.top;
                                self.cardUpdateProperty('settings.dimensions.x', Math.round(event.rect.left))
                                self.cardUpdateProperty('settings.dimensions.y', Math.round(event.rect.top))
                                // alert(self.card.id);
                                self.$emit('cardInteractJsDrag', self.id, false)

                            }
                        }
                    })
        },
                
        // loadContent() {
        //     return !this.isInStack;
            
        // },
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
        }
    },

    watch: {
        isInStack: {
            // console.log(o, n)
            // console.log(this.isInStack)
            // this.$nextTick(() => {
            //     console.log(this.isInStack)
            handler(n) {
                // console.log(o, "->", n)
                // if (n) this.loadContent = false
                
                // setTimeout(() => {
                    // console.log(o, "->", n)
                    // this.$nextTick(() => this.onCardMouseUp())
                    if (n === true) {
                        // this.loadContent = false
                        this.cardToStack()
                        
                    } else {
                        // this.loadContent = true
                        this.cardToBoard()
                        
                    }
                    // this.onCardMouseUp()
                // }, 100 + 100*this.index);
                // }, 1);
            }
            // })

        },

        stackPosition: {
            handler(n) {
                // this.$el.style.bottom = this.stackSettings.cardGap * (this.stackPosition)  + 'px';
                // console.log(n, o)
                // if (n > o) {
                    this.$el.style.bottom = this.stackSettings.cardGap * n  + 'px';

                // } else {
                    // this.$el.style.bottom = this.stackSettings.cardGap * n  + 'px';
                // }
            }
        },

        // card(n ,o) {
        //     // console.log(n, o)
        // }
    },
}
</script>


<style>

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    /* width: 100%; */
    max-height: 34px;
    opacity: 0; 
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
    margin-right: 11px;
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

.card-header-controls-close {
    cursor: pointer;

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
    height: 28px;
    /* margin-right: 10px; */
}

.card-header-title h1 {
    font-size: 22px;
    margin-left: 10px;
    color: black;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.card-header-title-input {
    font-size: 22px;
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
    /* justify-content: center; */
    /* align-items: stretch; */
    /* background-color: rgba(0,0,0,0.15); */
    /* overflow: hidden; */
    /* overflow: hidden; */
    /* overflow-y:auto; */
    overflow-y:hidden;
    overflow-x: hidden;
    touch-action: none;
    
}

.card-icon-instack {
    height: 50px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    /* right: 0; */
}

.test {
    flex:1;
    /* overflow: hidden; */
    /* width: 100%; */
    /* height: 100%; */
    
}

.card-body p {
    font-size: 20px;
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
    width: 225px;
    height: 225px;
    transition: top 0.5s ease, 
                left 0.5s ease, 
                bottom 0.5s ease, 
                margin 1s,
                opacity 0.11s,
                /* opacity 0.8s, */
                transform 0.15s ease,
                /* transform 1.5s ease, */
                width 0.8s ease-in-out,
                height 0.8s ease-in-out,
                ;



    user-select: none;

    touch-action: none;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    /* align-items:stretch; */
    /* float:left; */
    border-radius: 13px;
    box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.75);
    /* background-color: none; */
    overflow: hidden;
    /* background-color: rgba(0,0,0,0.1); */
    /* pointer-events: none; */


}


.card:after {
    content: '';
    position: absolute;
    right: 50px;
    top: 7px;
    border-radius: 100%;
    width: 25px;
    height: 25px;
    /* box-shadow: 0px 0px 0px 9999px white; */
    /* box-shadow: 0px 0px 0px 0px white; */
    z-index: -1;
    /* overflow: visible; */
}

.card-no-delay {
    transition: none !important;
}

.card-in-stack {
    position: absolute;
    /* opacity: 1; */
    opacity: 0.15;
    /* transform: rotate3d(-41, 14, 15, 50deg); */
    transform-style: preserve-3d;
    /* transform: scale(0.8); */

}

.card-in-stack:hover {
    opacity: 1 !important;
}

.card-on-board {
    position: absolute;
    transform: none;
    /* opacity: 1; */
}
</style>
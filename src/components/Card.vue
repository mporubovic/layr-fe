        @mouseup="onCardMouseUp"
        @mousemove="onCardMouseMove"
        @mousedown="isInStack ? onCardMouseDown : null"
@mouseup="onCardMouseUp"
@mousedown="isInStack ? onCardMouseDown() : null"

                @mousedown="isInStack ? onCardMouseDown() : null"
                @mouseover="onCardHeaderMouseOver"
                @mouseleave="onCardHeaderMouseLeave"
                @mouseover="onCardHeaderMouseDown"

                
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
            <div class="card-header-title card-header-drag-handle">
                <h1>{{ card.info.title }}</h1>
            </div>

            <div class="card-header-controls "
                    @mouseup="isInStack ? null : onCardMouseUp()"
                    >
                ✕
            </div>
            
        </div>

        <div class="card-body card-body-resize-handle" id="card-body"
                @mousedown="isInStack ? onCardMouseDown() : cardChildPointerEvents()"
                @mouseup="isInStack ? onCardMouseUp() : null"
                @mouseover="onCardBodyMouseOver"
                @mouseleave="onCardBodyMouseLeave"
                :style="cardBodyDynamicStyle"
                >

            <div class="test">

            </div>
                <component v-if="loadContent()"
                            :is="cardProgram(card)" 
                            :content="card.content"
                            :contentComponent="cardContentComponentName(card)"
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
            
            <!-- <h1>ix {{ indexAsData }}</h1>
            <h2>id {{ id }}</h2> -->
            <!-- <h1 v-if="isInStack">I {{ index }}</h1> -->
            <h2 style="font-size: 60px; margin-left: 10px;" v-if="isInStack">{{ card.info.type }}</h2>
        
        </div>




    </div>
        
</template>

<script>
import interact from 'interactjs';

export default {
    
    // props: ['card', 'index'],
    props: {
        card: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true, 
        },
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

            stackPosition: 0,

            boardPosition: {
                x: null,
                y: null,
            },

            dimensions: this.card.info.dimensions,

            isInStack: true,
            mouseDown: false,


            id: this.card.info.id,

            // hasFocus: false,

            headerDoubleTap: 0,

            indexAsData: this.index,


        }
    },
    
   
    computed: {
        cardDynamicStyle() {
            
                return this.isInStack ? { 'z-index': this.indexAsData} : {'z-index': this.indexAsData};

        },

        cardBodyDynamicStyle() {
            return this.isInStack ? {'background-color': "white"} : null
        },

        // loadContent() {
        //     return !this.isInStack;
        // }


    },
    
    mounted() {
        this.calcBoundingRect();
        // this.stackPosition = (this.indexAsData -1 );
        this.stackPosition = (this.indexAsData);
        this.$el.style.bottom = this.stackPosition * this.stackSettings.cardGap + 'px'
        this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg) scale(0.8)";
    
        // let r = Math.floor(Math.random()* 254) ;
        // let g = Math.floor(Math.random()* 254) ;
        // let b = Math.floor(Math.random()* 254) ;
        // let a = 0.9;
        // // alert('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
        // this.$el.style["background-color"] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

        this.initializeInteractJsResizable();
        this.initializeInteractJsDraggable();


        // this.$el.classList.remove();
 
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
                    return "url-list";     
                    
                case("text") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "white";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "white";

                    return "text-editor";  
            }
        },

        cardContentComponentName(card) {
            switch (card.info.type) {
                
                case("image") :
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "rgba(0,0,0,0.15)";

                    }, 0);
                    
                    return "image-viewer";   
                    
                case("video") :
                    return "video-component";                
                
                case("pdf") :
                    this.$el.querySelector(".card-body").style.padding = "15px 15px 15px 15px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "#D1D1D1";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "#D1D1D1";

                    return "pdf-component";                
                
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
                    return "url-component";     
                    
                case("text") :
                    this.$el.querySelector(".card-body").style.padding = "10px 10px 10px 10px";
                    setTimeout(() => {
                        this.$el.querySelector(".card-body").style["background-color"] = "white";
                    }, 0);
                    
                    // this.$el.style["background-color"] = "white";

                    return "text-component";  
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

        onCardMouseUp() {
            

            this.mouseDown = true;
            
            
            if (this.isInStack) {
                // alert('GO TO BOARD');
                this.$emit('cardStackInteraction', this.indexAsData, true);
                
                this.$el.classList.remove("card-in-stack");
                this.$el.classList.add("card-on-board");
                this.calcBoundingRect();
                
                
                document.getElementById("cards").appendChild(this.$el);
                
                this.$el.style.bottom = "" ;
                this.$el.style.top = this.boundingRect.y + 'px' ;
                this.$el.style.left = this.boundingRect.x + 'px';
                
            

                setTimeout(() => {
                    
                    
                    this.$el.style.left = this.dimensions.x + 'px';
                    this.$el.style.top = this.dimensions.y + 'px';

                    this.$el.style.width = this.dimensions.width + 'px';
                    this.$el.style.height = this.dimensions.height + 'px';


                    this.$el.style.opacity = 1;
                    this.$el.children[0].style.opacity = 1;


                    this.$el.style.transform = "";
                }, 0);

                interact(this.$refs['card'+this.id]).draggable(true).resizable(true);
                
                this.$el.classList.add('draggable');
                this.$el.classList.add('resizable');
                this.isInStack = false;
            } else {
                // alert('GO TO STACK');

                let brStack = this.$parent.calculateBoundingRectangle();
                this.$emit('cardStackInteraction', this.indexAsData, false);
                
                
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

                    
                }, 0);
                this.$el.classList.add("card-in-stack");
                
                // interact('.resizable').resizable(false);
                // interact('.draggable').draggable(false);
                
                interact(this.$refs['card'+this.id]).draggable(false).resizable(false);
                crd.classList.remove('draggable');
                crd.classList.remove('resizable');
                
                
                this.isInStack = true;

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
            this.headerDoubleTap++

            setTimeout(() => {
                this.headerDoubleTap = 0;
            }, 400);

            if (this.headerDoubleTap === 2) {
                this.headerDoubleTap = 0;
                this.$emit('cardBringForward', this);
            }

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
                            
                            self.dimensions.x = event.rect.left;
                            self.dimensions.y = event.rect.top;
                        },

                        end (event) {
                            event.target.classList.remove("card-no-delay");
                            // alert('uwaga');
                            self.dimensions.width = event.rect.width;
                            self.dimensions.height = event.rect.height;
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
                            min: { width: 225, height: 225 }
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
                                self.dimensions.x = event.rect.left;
                                self.dimensions.y = event.rect.top;
                                // alert(self.card.id);
                                self.$emit('cardInteractJsDrag', self.id, false)

                            }
                        }
                    })
        },
                
        loadContent() {
            return !this.isInStack;
            
        },
        programUpdatedContent(programName, updatedContent) {
            // console.log(programName, updateFunction, updatedContent)
            this.$emit('cardProgramUpdatedContent', programName, updatedContent, this.id)

        },

        programCreatedContent(programName) {
            // console.log(programName, updateFunction, updatedContent)
            this.$emit('cardProgramCreatedContent', programName, this.id)

        },

        programDeletedContent(programName, deletedContent) {
            this.$emit('cardProgramDeletedContent', programName, deletedContent, this.id)
        }
    }
}
</script>


<style>

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    /* width: 100%; */
    opacity: 0; 
    background-color: white;
    /* outline: 1px black solid; */
    border-bottom: 1px black solid;

}

.card-header-controls {
    color: black;
    font-size: 25px;
    padding-right: 15px;

}

.card-header-title {
    /* padding-left: 10px; */
    flex: 1;

}

.card-header-title h1 {
    font-size: 25px;
    margin: 0px;
    padding-left: 15px;
    color: black;
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
    overflow-y:auto;
    touch-action: none;
    
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
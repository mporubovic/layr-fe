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
        :ref="'card' + index"  
        key="index"
        :style="cardDynamicStyle"
        @mouseover="onCardMouseOver"
        @mouseleave="onCardMouseLeave"
        >
        
        <div class="card-header "
            
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

        <div class="card-body card-body-resize-handle"
                @mousedown="isInStack ? onCardMouseDown() : null"
                @mouseup="isInStack ? onCardMouseUp() : null"
                @mouseover="onCardBodyMouseOver"
                @mouseleave="onCardBodyMouseLeave"
                
                >
            <!-- <p>Card description</p> -->
        
<!--             
            <p> CARD ID {{ id }}</p>

            <p> IS HOVERING {{ isHovering }}</p>

            <p>in STACK {{ isInStack }}</p> -->
            <!-- TEXT -->
            <slot v-if="loadContent()"></slot>   
            
            
            <!-- <h1 v-if="isInStack">N {{ id }}</h1> -->
            <h2 style="font-size: 60px;" v-if="isInStack">{{ card.info.type }}</h2>
            <!-- <h4>[EMPTY]</h4> -->
        
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


        }
    },
    
   
    computed: {
        cardDynamicStyle() {
            
                return this.isInStack ? { 'z-index': this.index} : {'z-index': this.index};

        },

        // loadContent() {
        //     return !this.isInStack;
        // }


    },
    
    mounted() {
        this.calcBoundingRect();
        // this.stackPosition = (this.index -1 );
        this.stackPosition = (this.index);
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
        startupAnimation () {
            this.onCardMouseDown();
        },
        
        calcBoundingRect() {
            let cid = 'card' + this.index;
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
            // this.$el.style.transform -= "rotateX(15deg)";

        },

        onCardMouseUp() {
            

            this.mouseDown = true;
            
            
            if (this.isInStack) {
                // alert('GO TO BOARD');
                this.$emit('cardStackInteraction', this.index, true);
                
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

                interact(this.$refs['card'+this.index]).draggable(true).resizable(true);
                
                this.$el.classList.add('draggable');
                this.$el.classList.add('resizable');
                this.isInStack = false;
            } else {
                // alert('GO TO STACK');

                let brStack = this.$parent.calculateBoundingRectangle();
                this.$emit('cardStackInteraction', this.index, false);
                
                
                // this.$el.offsetHeight;
                this.$el.classList.remove("card-on-board");
                this.$el.classList.add("card-in-stack");
                let cid = 'card' + this.index;
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
                    
                }, 0);
                this.$el.classList.add("card-in-stack");
                
                // interact('.resizable').resizable(false);
                // interact('.draggable').draggable(false);
                
                interact(this.$refs['card'+this.index]).draggable(false).resizable(false);
                crd.classList.remove('draggable');
                crd.classList.remove('resizable');
                
                
                this.isInStack = true;

            }
        
        },

        onCardMouseDown() {
            
            this.$el.style.transform += "translateY(10px)" ;


            
            
        },


        onCardMouseMove() {
        },

        onCardBodyMouseOver() {
            this.$el.style.cursor = "grab";
        },

        onCardBodyMouseLeave() {
            this.$el.style.cursor = "";
        },

        onCardHeaderMouseOver() {
            this.$el.style.cursor = "grab";
        },
        
        onCardHeaderMouseLeave() {
            this.$el.style.cursor = "";
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
            
        initializeInteractJsResizable() {
            let self = this;
            interact(this.$refs['card'+this.index])
                .resizable({
                    enabled: false,
                    // resize from all edges and corners
                    edges: { left: true, right: true, bottom: true, top: false },

                    allowFrom: '.card-body-resize-handle',
                    ratio: 1,
                    // ratio: 800/526,

                    listeners: {
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

            interact(this.$refs['card'+this.index])
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

                            }
                        }
                    })
        },
                
        loadContent() {
            return !this.isInStack;
            
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
    /* background-color: white; */
    outline: 1px black solid;

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
    padding-left: 10px;
    color: black;
}

.card-body {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.15);
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
                height 0.8s ease-in-out;



    user-select: none;

    touch-action: none;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items:stretch;
    /* float:left; */
    border-radius: 13px;
    box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.75);
    /* background-color: white; */
    overflow: hidden;
    background-color: rgba(0,0,0,0.1);


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
        @mouseup="onCardMouseUp"
        @mousemove="onCardMouseMove"
        @mousedown="isInStack ? onCardMouseDown : null"
@mouseup="onCardMouseUp"
@mousedown="isInStack ? onCardMouseDown() : null"

                @mousedown="isInStack ? onCardMouseDown() : null"
                @mouseover="onCardHeaderMouseOver"
                @mouseleave="onCardHeaderMouseLeave"

<template>
    <div class="card card-in-stack" 
        :ref="'card' + id"  
        key="id"
        :style="cardDynamicStyle"
        @mouseover="onCardMouseOver" 
        @mouseleave="onCardMouseLeave"
        >
        
        <div class="card-header "

            >
            <div class="card-header-title card-header-drag-handle">
                <h1>Card title</h1>
            </div>

            <div class="card-header-controls "
                    @mousedown="isInStack ? null : onCardMouseDown()"
                    >
                ✕
            </div>
            
        </div>

        <div class="card-body card-body-resize-handle"
                @mousedown="isInStack ? onCardMouseDown() : null"
                @mouseover="onCardBodyMouseOver"
                @mouseleave="onCardBodyMouseLeave"
                >
            <!-- <p>Card description</p> -->
        
<!--             
            <p> CARD ID {{ id }}</p>

            <p> IS HOVERING {{ isHovering }}</p>

            <p>in STACK {{ isInStack }}</p> -->
            <!-- TEXT -->
            <h1>{{ id }}</h1>
        
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

            isInStack: true,
            mouseDown: false,


            id: this.card.id,

        }
    },
    
   
    computed: {
        cardDynamicStyle() {
            
                return this.isInStack ? { 'z-index': this.index} : {'z-index': this.index};

        },


    },
    
    mounted() {
        this.calcBoundingRect();
        this.stackPosition = (this.card.id -1 );
        this.$el.style.bottom = this.stackPosition * this.stackSettings.cardGap + 'px'
        this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg)";
    
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
            let cid = 'card' + this.card.id;
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
                this.$el.style.transform += "rotate3d(-41, 14, 15, 50deg) rotateX(15deg)";
            }

        },
        
        onCardMouseLeave() {
            this.isHovering = false;
            if (this.isInStack) {
                this.$el.children[0].style.opacity = 0;
                this.$el.style.transform = "";
                this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg)";
            }
            // this.$el.style.transform -= "rotateX(15deg)";

        },

        onCardMouseDown() {
            

            this.mouseDown = true;
            
            
            if (this.isInStack) {
                // alert('GO TO BOARD');
                this.$emit('cardStackInteraction', this.index, true);
                
                this.$el.classList.remove("card-in-stack");
                this.$el.classList.add("card-on-board");
                this.calcBoundingRect();
                
                let cid = 'card' + this.card.id;
                let crd = this.$refs[cid];
                
                document.getElementById("cards").appendChild(crd);
                
                crd.style.bottom = "" ;
                crd.style.top = this.boundingRect.y + 'px' ;
                crd.style.left = this.boundingRect.x + 'px';
                // crd.style.opacity = 1;

                setTimeout(function() {
                    crd.style.top = Math.floor( Math.random() * 800 ) + 'px';

                    crd.style.left = Math.floor(Math.random() * 1400 ) + 'px';

                    crd.style.opacity = 1;
                    crd.children[0].style.opacity = 1;


                    crd.style.transform = "";
                }, 0);


                crd.classList.add('draggable');
                crd.classList.add('resizable');
                this.isInStack = false;
            } else {
                // alert('GO TO STACK');

                let brStack = this.$parent.calculateBoundingRectangle();
                this.$emit('cardStackInteraction', this.index, false);
                
                
                // this.$el.offsetHeight;
                this.$el.classList.remove("card-on-board");
                this.$el.classList.add("card-in-stack");
                let cid = 'card' + this.card.id;
                let br = this.$refs[cid].getBoundingClientRect();
                let crd = this.$refs[cid];
                
                crd.setAttribute('data-x', 0);
                crd.setAttribute('data-y', 0);
                
                document.getElementById("stack-cards").appendChild(crd);

                
                
                this.$el.style.transform = "";
                this.$el.style.top = "";
                
                console.log(brStack);
                this.$el.style.bottom =  (brStack.y - br.y - br.height ) + 'px' ;
                // this.$el.style.bottom =  300 + 'px' ; 
                this.$el.style.left = br.x - brStack.x + 'px' ;
                // this.$el.style.left = brStack.x - br.x + 'px' ;

                crd.style.opacity = 1;


                
                setTimeout(function() {
                    
                    crd.style.bottom = (this.stackPosition * this.stackSettings.cardGap) + 'px';

                    crd.style.left = 0;
                    this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg)";
                    crd.children[0].style.opacity = 0;
                    this.$el.style.opacity = 0.15;
                    
                }.bind(this), 1);
                this.$el.classList.add("card-in-stack");
                
                // interact('.resizable').resizable(false);
                // interact('.draggable').draggable(false);
                
                crd.classList.remove('draggable');
                crd.classList.remove('resizable');
                this.isInStack = true;

            }
        
        },

        onCardMouseUp() {
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
            interact('.resizable')
                .resizable({
                    // resize from all edges and corners
                    edges: { left: true, right: true, bottom: true, top: false },

                    allowFrom: '.card-body-resize-handle',

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
                        },

                        end (event) {
                            event.target.classList.remove("card-no-delay");
                        }
                    },
                    modifiers: [
                    // keep the edges inside the parent
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),

                    // minimum size
                    interact.modifiers.restrictSize({
                        min: { width: 200, height: 200 }
                    })
                    ],

                    inertia: true
                })
                
            
        },
        
        initializeInteractJsDraggable() {

            interact('.draggable')
                    .draggable({
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


                            }
                        }
                    })
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
    width: 100%;
    opacity: 0; 
}

.card-header-controls {
    color: black;
    font-size: 25px;
    padding-right: 15px;

}

.card-header-title {
    padding-left: 10px;

}

.card-header-title h1 {
    font-size: 30px;
    margin: 0px;
    color: black;
}

.card-body {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: center;
}

.card-body p {
    font-size: 20px;
    margin: 0px;
    color: black;
}

.card-body h1 {
    font-size: 100px;
    margin: 0px;
    /* padding: 0px; */
    color: black;
}


.card {
    width: 200px;
    height: 200px;
    transition: top 0.5s ease, 
                left 0.5s ease, 
                bottom 0.5s ease, 
                margin 1s,
                opacity 0.11s,
                /* opacity 0.8s, */
                transform 0.15s ease;



    user-select: none;

    touch-action: none;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items:stretch;
    /* float:left; */
    border-radius: 14px;
    box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.75);
    /* background-color: white; */
    overflow: hidden;

}

.card:after {
    content: '';
    position: absolute;
    right: 7px;
    bottom: 7px;
    border-radius: 100%;
    width: 15px;
    height: 15px;
    box-shadow: 0px 0px 0px 2000px white;
    z-index: -1;
    /* overflow: hidden; */
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
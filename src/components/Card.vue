        @mouseup="onCardMouseUp"
        @mousemove="onCardMouseMove"
        

<template>
    <div class="card card-in-stack" 
        :ref="'card' + id"  
        key="id"
        :style="cardDynamicStyle"
        @mouseover="onCardMouseOver" 
        @mouseleave="onCardMouseLeave"
        @mousedown="onCardMouseDown"
        @mouseup="onCardMouseUp"

        >
        
        <div class="card-title">
            <h1>Card title</h1>
        </div>

        <div class="card-body">
            <!-- <p>Card description</p> -->
        
<!--             
            <p> CARD ID {{ id }}</p>

            <p> IS HOVERING {{ isHovering }}</p>

            <p>in STACK {{ isInStack }}</p> -->

            <h1>{{ id }}</h1>
        
        </div>



    </div>
        
</template>

<script>
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
            
                return this.isInStack ? { 'z-index': this.index} : {};
        },


    },
    
    mounted() {
        this.calcBoundingRect();
        this.calcStackBoundingRect();
        this.stackPosition = (this.card.id -1 );
        this.$el.style.bottom = this.stackPosition * this.stackSettings.cardGap + 'px'
        this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg)";
        let r = Math.floor(Math.random()* 254) ;
        let g = Math.floor(Math.random()* 254) ;
        let b = Math.floor(Math.random()* 254) ;
        let a = 0.9;
        // alert('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
        this.$el.style["background-color"] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

 
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

        calcStackBoundingRect() {
            let cid = 'card' + this.card.id;
            let br = this.$refs[cid].getBoundingClientRect();
            this.stackBoundingRect.x = br.x;
            this.stackBoundingRect.y = br.y;
            this.stackBoundingRect.width = br.width;
            this.stackBoundingRect.height = br.height;
        },

        onCardMouseOver() {
            this.isHovering = true;
            if (this.isInStack) {
                this.$el.style.transform = "";
                this.$el.style.transform += "rotate3d(-41, 14, 15, 50deg) rotateX(15deg)";
            }

        },
        
        onCardMouseLeave() {
            this.isHovering = false;
            if (this.isInStack) {
                this.$el.style.transform = "";
                this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg)";
            }
            // this.$el.style.transform -= "rotateX(15deg)";

        },

        onCardMouseDown() {
             
            

            this.mouseDown = true;
            
            
            if (this.isInStack) {
                
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
                // crd.style.transform += "rotateX(15deg)";

                setTimeout(function() {
                    crd.style.top = Math.floor( Math.random()* 500 ) + 'px';

                    crd.style.left = Math.floor(Math.random()* 500 ) + 'px';

                    crd.style.transform = "";
                }, 0);

                
                this.isInStack = false;
            } else {
                // alert('uwaga');
                this.$emit('cardStackInteraction', this.index, false);
                
                this.$el.classList.remove("card-on-board");
                this.$el.classList.add("card-in-stack");
                let cid = 'card' + this.card.id;
                let br = this.$refs[cid].getBoundingClientRect();
                
                let crd = this.$refs[cid];
                
                
                document.getElementById("stack").appendChild(crd);

                
                
                this.$el.style.top = "";
                this.$el.style.bottom =  (this.stackBoundingRect.y - br.y - 200 ) + 'px' ;
                this.$el.style.left = br.x - this.stackBoundingRect.x + 'px' ;

                
                setTimeout(function() {

                    crd.style.bottom = (this.stackPosition * this.stackSettings.cardGap) + 'px';

                    crd.style.left = 0;
                    this.$el.style.transform = "rotate3d(-41, 14, 15, 50deg)";
                    // this.$el.style.opcaity = 0.25;

                }.bind(this), 0);
                // this.$el.classList.add("card-in-stack");
                this.isInStack = true;

            }
        
        },

        onCardMouseUp() {
        },


        onCardMouseMove() {
        },

        setStackPosition(pos) {
            this.stackPosition = pos;
            this.$el.style.bottom = pos * this.stackSettings.cardGap + 'px';
        }
    }
}
</script>


<style>

.card-title h1 {
    font-size: 30px;
    margin: 0px;
    color: white;
}

.card-body p {
    font-size: 20px;
    margin: 0px;
    color: white;
}

.card-body h1 {
    font-size: 120px;
    margin: 0px;
    color: white;
}

.card {
    width: 200px;
    height: 200px;
    transition: transform 0.15s ease, 
                top 0.5s ease, 
                left 0.5s ease, 
                bottom 0.5s ease, 
                margin 1s,
                opacity 0.10s;


    user-select: none;


}

.card-in-stack {
    position: absolute;
    /* opacity: 1; */
    opacity: 0.30;
    /* transform: rotate3d(-41, 14, 15, 50deg); */
    transform-style: preserve-3d;

}

.card-in-stack:hover {
    opacity: 1;
}

.card-on-board {
    position: absolute;
    transform: none;
    
}
</style>
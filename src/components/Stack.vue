<template>
    
    <div class="stack stack-draggable" id="stack">

        <div class="stack-cards" id="stack-cards">
            <card v-for="(card, index) in cards" 
                        :key="index" 
                        :card=card
                        :stackSettings="stackSettings"
                        :index=index
                        @cardStackInteraction="stackRearrangeCards"
                        >
                <component :is="imageViewer()" 
                            :content="content"></component>
            </card>
        </div>

        <div class="stack-controls">
            <button class="stack-controls-common stack-controls-toggle" id= "stack-controls-toggle" @click="toggleCardStack">Toggle</button>
            <button class="stack-controls-common stack-controls-drag">Drag</button>
            <button class="stack-controls-common stack-controls-edit">Edit</button>
        </div>
            
    </div>
</template>



<script>
import Card from './Card.vue';
import ImageViewer from './programs/ImageViewer.vue'
import interact from 'interactjs';

export default {
    components: {
        Card,
        ImageViewer,

    },

    methods: {
        imageViewer() {
            return ImageViewer;
        },
        
        initializeInteractJs() {
            interact('.stack-draggable')
                .draggable({
                    // enable inertial throwing
                    inertia: true,

                    allowFrom: '.stack-controls-drag',
                    // keep the element within the area of it's parent
                    modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                    ],
                    // enable autoScroll
                    autoScroll: false,

                    listeners: {
                    // call this function on every dragmove event
                        move (event) {
                            
                            var target = event.target
                            
                            target.classList.add("stack-no-delay");
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

                        end (event) {
                            var target = event.target
                            target.classList.remove("stack-no-delay");
                        }
                    }
                })
        },
        
        stackRearrangeCards(index, stackToBoard) {
            let crds = this.cardsInStack
            if (stackToBoard) {
                let bottomCardIndex = crds.findIndex(function(card) {
                    return card.index === index;
                });
                
                let crdsAbove = crds.slice(bottomCardIndex, crds.length);
                
                crdsAbove.forEach(element => {
                    element.$el.style.bottom = this.stackSettings.cardGap * (element.stackPosition - 1)  + 'px';

                    element.stackPosition -= 1
                });

            } else {
                
                let cardAbovePosition = crds.findIndex(function(card) {
                    return card.index > index;
                });

                if (cardAbovePosition !== -1) {
                    
                    let crdsAbove = crds.slice(cardAbovePosition, crds.length);
                    crdsAbove.forEach(element => {
                        element.$el.style.bottom = this.stackSettings.cardGap * (element.stackPosition + 1)  + 'px';
                        element.stackPosition += 1
                        this.$children[index].setStackPosition(cardAbovePosition);
                    });

                } else {
                    this.$children[index].setStackPosition(crds.length);
                }


            }

            

        },

        shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
            },

        toggleCardStack() {
                if (!this.controls.toggleActive) return;
                document.getElementById("stack-controls-toggle").style.opacity = 0.5;
                
                
                this.controls.toggleActive = false;
                
                let cards = this.cardsInStack.length > 1 
                            ? this.$children.slice().reverse()
                            // ? this.$children
                            : this.$children;
                
                cards.forEach((card, index) => {
                    setTimeout(() => {
                            requestAnimationFrame(function() {
                                card.onCardMouseDown();
                        })
                    }, 100 + 100*index); 


                
                });
                                    
                setTimeout(() => {
                    document.getElementById("stack-controls-toggle").style.opacity = 1;
                    this.controls.toggleActive = true;

                }, 100 + 100*this.cards.length);

        },

        generateCards(count) {
            let cards = [];
            for (let index = 0; index < count; index++) {
                cards.push(
                    {
                        "info": {
                            "id": index+1,
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": this.generateDimensions('width'),
                                "height": this.generateDimensions('height'),
                            }
                        }
                    }
                )
            
            }
            return cards;
        },

        generateDimensions(d) {
            switch (d) {
                case "x":
                    return  Math.floor(Math.random() * 1400 );
                
                case "y":
                    return  Math.floor(Math.random() * 800 );
                    
                case "width":
                    return  225 + Math.floor(Math.random() * 500 );
                    
                case "height":
                    return  225 + Math.floor(Math.random() * 200 );
            
                default:
                    break;
            }
        },

        calculateCardGap() {
            return 50 - this.cards.length * 1;
        },

        calculateBoundingRectangle() {
            return this.$el.getBoundingClientRect();

        }

    },

    mounted() {
        this.initializeInteractJs();

        // this.cardsInStack.forEach(function(card, index){
        //     setTimeout(() => {
        //         card.startupAnimation();
        //     }, 1000 + 100 * index);
            
        // });
    },

    computed: {
        cardsInStack() {
            return this.$children.filter(card => card.isInStack);
        },
        
        cardsOnBoard() {
            return this.$children.filter(card => !card.isInStack);
        },
        
        stackSettings() {
            
            let cardCount = this.cards.length;
            // alert(cardCount);
            // alert (cardCount > 45) ? 25 : (50 - cardCount);
            // return (cardCount > 45) ? 25 : (50 - cardCount);
            // cardCount > 45 ? return 25 : return (50 - cardCount);
            // return {cardGap: 50 - this.cards.length * 1};
            // return cardCount <= 45 ? console.log(50 - cardCount) : console.log(5);
            return {
                cardGap: (cardCount <= 65 ? 75 - cardCount - 20 : 7),
                cardDimensions: {
                    width: 225,
                    height: 225,
                }
                // cardGap: -100,
            } 
            
        },

    },

    data() {
        return {
            cards: this.generateCards(20),
            
            // stackSettings: {
            //     cardGap: this.calculateCardGap(),
            // },
            // boundingRect: null,
            content: [
                'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/800px-Andromeda_Galaxy_%28with_h-alpha%29.jpg'
            ],

            controls: {
                toggleActive: true, 
            }
        }
    }
}
</script>



<style>


.stack { 
    position: fixed;

    bottom: 20px;
    right: 20px; 
    transition: all 0.2s;

    /* height: 100px;
    width: 100px; */
    /* width: 100px;
    height: 100px; */

    touch-action: none;
    box-sizing: border-box;
    z-index: 999;
    /* overflow: hidden; */

    
    
}

.stack-no-delay {
    transition: none !important;
}

.stack-controls {
    /* position: absolute; */ 
    /* margin-top: 30px; */
    /* margin-left: -25px; */
    width: 220px;
    outline: black solid 0px;
    /* display: table-row; */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    user-select: none;
}

.stack-controls-common {
    background-color: white;
    text-decoration: none;
    cursor: pointer;
    font-size: 15px;
    padding: 5px 15px 5px 15px;
    border-radius: 99px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    transition-duration: 0.2s;
}

.stack-controls-drag:active {
    cursor: grabbing;
    background-color: lightgreen;
}


.stack-cards {
    position: relative;
    margin-left: 1px;
    /* bottom: 150px; */
    margin-bottom: -20px;
}

</style>
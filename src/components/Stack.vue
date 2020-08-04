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
            </card>
        </div>

        <div class="stack-controls">
            <button @click="toggleCardStack">Toggle</button>
            <p class="handle">drag me</p>
        </div>
            
    </div>
</template>



<script>
import Card from './Card.vue';
import interact from 'interactjs';

export default {
    components: {
        Card,

    },

    methods: {
        initializeInteractJs() {
            interact('.stack-draggable')
                .draggable({
                    // enable inertial throwing
                    inertia: true,

                    allowFrom: '.handle',
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
                let cards = this.cardsInStack.length > 1 
                            // ? this.$children.slice().reverse()
                            ? this.$children
                            : this.$children;
                
                cards.forEach((card, index) => {
                    setTimeout(() => {
                            requestAnimationFrame(function() {
                                card.onCardMouseDown();
                        })
                    }, 100 + 100*index); 
                
                });
                

        },

        generateCards(count) {
            let cards = [];
            for (let index = 0; index < count; index++) {
                cards.push({"id": index+1});      
            }
            return cards;
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
                cardGap: (cardCount <= 65 ? 70 - cardCount : 7),
            } 
            
        },

    },

    data() {
        return {
            cards: this.generateCards(15),
            
            // stackSettings: {
            //     cardGap: this.calculateCardGap(),
            // },
            // boundingRect: null,
        }
    }
}
</script>



<style>


.stack { 
    position: fixed;
    /* top: 600px;
    left: 1600px; */
    bottom: 50px;
    right: 250px; 
    transition: all 0.2s;
    /* transform: scale(0.9); */
    /* height: 100%; */
    /* width: 100px;
    height: 100px; */
    /* min-height: 300px; */
    /* overflow:visible; */

    touch-action: none;
    box-sizing: border-box;
    z-index: 999;
    /* display: table; */
    /* display: inline; */
    /* display: table; */

    
    
}

.stack-no-delay {
    transition: none !important;
}

.stack-controls {
    position: relative;
    margin-top: 10px;
    width: 100%;
    outline: black solid 1px;
    /* display: table-row; */
}

</style>
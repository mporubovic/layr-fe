<template>
    
    <div class="stack" id="stack">
        <button @click="toggleCardStack">Toggle</button>
        
        <card v-for="(card, index) in cards" 
                    :key="index" 
                    :card=card
                    :stackSettings="stackSettings"
                    :index=index
                    @cardStackInteraction="stackRearrangeCards"
                    >
        </card>
    </div>
</template>



<script>
import Card from './Card.vue'

export default {
    components: {
        Card,

    },

    methods: {
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
                            ? this.$children.slice().reverse()
                            : this.$children;
                
                cards.forEach((card, index) => {
                    setTimeout(() => {
                            requestAnimationFrame(function() {
                                card.onCardMouseDown();
                        })
                    }, 50 + 100*index); 
                
                });
                

        }

    },

    mounted() {

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
        }
    },

    data() {
        return {
            cards: [
                {"id": 1, "title": "first", "body": "one"},
                {"id": 2, "title": "second", "body": "two"},
                {"id": 3, "title": "third", "body": "three"},
                {"id": 4, "title": "fourth", "body": "four"},
                {"id": 5, "title": "fourth", "body": "four"},
                {"id": 6, "title": "fourth", "body": "four"},
                {"id": 7, "title": "fourth", "body": "four"},
                {"id": 8, "title": "fourth", "body": "four"},
                {"id": 9, "title": "fourth", "body": "four"},
                {"id": 10, "title": "fourth", "body": "four"},
                {"id": 11, "title": "fourth", "body": "four"},
                {"id": 12, "title": "fourth", "body": "four"},
            ],
            
            stackSettings: {
                cardGap: 50,
            },
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
    transform: scale(0.9);
    /* height: 10px;
    width: 10px; */
    
}
</style>
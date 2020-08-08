

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
                
                <component :is="cardProgram(card.info.type)" 
                            :content="card.content"
                            :cardId="card.info.id"
                            >
                </component>
            </card>
        </div>

        <div class="stack-controls" id="stack-controls">
            <!-- <button class="stack-controls-s">S</button> -->
            <button class="stack-controls-common stack-controls-toggle" id= "stack-controls-toggle" @click="toggleCardStack">{{ toggleButtonText }}</button>
            <button class="stack-controls-common stack-controls-drag">Move</button>
            <button class="stack-controls-common stack-controls-edit">Edit</button>
        </div>
            
    </div>
</template>



<script>
import Card from './Card.vue';
import interact from 'interactjs';

import ImageViewer from './programs/ImageViewer.vue'
import VideoViewer from './programs/VideoViewer.vue'
import PdfViewer from './programs/PdfViewer.vue'
import TextEditor from './programs/TextEditor.vue'



export default {
    components: {
        Card,
        ImageViewer,
        VideoViewer,
        PdfViewer,
        TextEditor,

    },

    data() {
        return {
            cards: this.generateCards(2),
            
            // stackSettings: {
            //     cardGap: this.calculateCardGap(),
            // },
            // boundingRect: null,

            controls: {
                toggleActive: true, 
                toggleExpand: true
            },

            cardLoadContent: false,

        }
    },
    
    
    methods: {
        cardProgram(type) {
            switch (type) {
                
                case("image") :
                    return "ImageViewer";   
                    
                case("video") :
                    return "VideoViewer";                
                
                case("pdf") :
                    return "PdfViewer";                
                
                case("todo") :
                    return "TodoViewer";                
                
                case("url") :
                    return "UrlViewer";     
                    
                case("text") :
                    return "TextEditor";  
            }
        },

        isCardInStack(index) {
            if ( this.cardsInStack[index] !== null ) {
                return false;
            } else {
                return false;
            }
        },

        generateCards(count) {
            let cards = [];
            for (let index = 0; index < count; index++) {
                cards.push(
                    {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": this.generateDimensions('width'),
                                "height": this.generateDimensions('height'),
                            },
                            "type": "pdf", 
                            "title": "NFX"
                        },

                        "content": [
                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                                    "name": "NFX"
                                }    
                            }
                        ],

                    },
                    
                    {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": this.generateDimensions('width'),
                                "height": this.generateDimensions('height'),
                            },
                            "type": "image", 
                            "title": "Andromeda"
                        },

                        "content": [
                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/800px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
                                    "name": "AndromedaAndromedaAndromedaAndromedaAndromedaAndromedaAndromedaAndromedaAndromeda"
                                }

                            },


                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/ne0213-last-hubble-mission.jpg',
                                    "name": "Hubble"
                                }

                            },

                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/potw2005a.jpg',
                                    "name": "Hubble"
                                }

                            },

                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/potw2006a.jpg',
                                    "name": "Hubble"
                                }

                            },
                            {

                                "meta": {},
                                "file": {
                                    "url": 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/potw2004a.jpg',
                                    "name": "Hubble"
                                }

                            },

                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/potw2003a.jpg',
                                    "name": "Hubble"
                                }

                            },

                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/potw2002a.jpg',
                                    "name": "Hubble"
                                }

                            },


                        ]
                    },
                    {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": this.generateDimensions('width'),
                                "height": this.generateDimensions('height'),
                            },
                            "type": "text", 
                            "title": "Text editor"
                        },

                        "content": [
                            {
                                "meta": {},
                                "file": {
                                    "url": 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                                    "name": "NFX"
                                }    
                            }
                        ],

                    },
                )
            
            }
            return cards;
        },
        
        initializeInteractJs() {
            interact('.stack-draggable')
            // interact('.stack-controls')
                .draggable({
                    // enable inertial throwing
                    inertia: true,

                    allowFrom: '.stack-controls-drag',
                    // keep the element within the area of it's parent
                    modifiers: [
                    // interact.modifiers.restrictRect({
                    //     // restriction: 'parent',
                    //     restriction: document.getElementById('stack-controls'),
                    //     endOnly: true
                    // })

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
                            // var target = document.getElementById('stack')
                            
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

                        // end (event) {
                        end (event) {
                            var target = event.target
                            // var target = document.getElementById('stack')
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

            setTimeout(() => {
                this.cardLoadContent = true;
            }, 1000);

            

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
                                card.onCardMouseUp();
                        })
                    }, 100 + 100*index); 


                
                });
                                    
                
                setTimeout(() => {
                    document.getElementById("stack-controls-toggle").style.opacity = 1;
                    this.controls.toggleActive = true;
                    this.controls.toggleExpand = !this.controls.toggleExpand;

                }, 700 + 100*this.cards.length);

        },

        generateDimensions(d) {
            switch (d) {
                case "x":
                    return  Math.floor(Math.random() * 1200 );
                
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

        },

        loadContent(card) {
            return this.cardsInStack.includes(card);
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

        toggleButtonText() {
            // return this.controls.toggleExpand ? "Expand" : "Collapse";
            return this.controls.toggleExpand ? "Open" : "Close";
        },

        // cardLoadContent(index) {
        //     this.cards[index].info
        // }

    },
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
    /* height: 20px; */
    /* display: flex; */
    /* flex-direction: column; */
    /* justify-content: center; */
    /* align-items: center; */

    
    
}

.stack-no-delay {
    transition: none !important;
}

.stack-controls {
    /* position: absolute; */ 
    /* margin-top: 30px; */
    /* margin-left: -25px; */
    width: 240px;
    height: 50px;
    /* outline: black solid -5px; */
    background-color: rgba(0, 0, 0, 0.30);
    /* display: table-row; */
    /* position: absolute; */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 99px;
    /* box-sizing: border-box; */
    /* bottom: 20px; */
}

.stack-controls-common {
    background-color: white;
    text-decoration: none;
    cursor: pointer;
    font-size: 15px;
    /* height: 30px; */
    padding: 5px 15px 5px 15px;
    border-radius: 99px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    transition: all 0.5s;
}

.stack-controls-drag:active {
    cursor: grabbing;
    background-color: lightgreen;
}

.stack-controls-s {
    background-color:orange;
    color: white;
    text-decoration: none;
    /* cursor: none; */
    font-size: 20px;
    height: 30px;
    width: 30px;
    padding: 5px 10px 5px 9px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    border-radius: 99px;
    /* text-align: center;  */
    /* box-sizing: border-box; */
    line-height: 10px;
}


.stack-cards {
    position: relative;
    margin-left: 20px;
    /* bottom: 150px; */
    margin-bottom: -20px;
    padding-bottom: 20px;
    z-index: -20;
    /* overflow: hidden; */
}

</style>
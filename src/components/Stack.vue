        <div class="stack-controls" id="stack-controls">
            <!-- <button class="stack-controls-s">S</button> -->
            <button class="stack-controls-common stack-controls-toggle" id= "stack-controls-toggle" @click="toggleCardStack">{{ toggleButtonText }}</button>
            <button class="stack-controls-common stack-controls-drag">Move</button>
            <button class="stack-controls-common stack-controls-edit">Edit</button>
            <button class="stack-controls-common stack-controls-add-wrapper"><div class="stack-controls-add">+</div></button>
        </div>

<template>
    
    <div class="stack stack-draggable" id="stack">

        <div class="stack-cards" id="stack-cards">
            <!-- <card v-for="(card, index) in cards"  -->
            <card v-for="(card, index) in cards" 
                        :key="card.info.id"
                        :ref="'card-' + card.info.id"
                        :card=card
                        :stackSettings="stackSettings"
                        :index=index
                        :hasFocus="cardsHaveFocus"
                        @cardStackInteraction="stackRearrangeCards"
                        @cardInteractJsDrag="cardsSetFocus"
                        @cardInteractJsResize="cardsSetFocus"
                        @cardBringForward="cardBringForward"
                        @cardProgramUpdatedContent="cardProgramUpdatedContent"
                        @cardProgramCreatedContent="cardProgramCreatedContent"
                        @cardProgramDeletedContent="cardProgramDeletedContent"
                        @cardUpdatedItself="cardUpdatedItself"
                        >
            </card>
        </div>

        
        <div class="stack-new-card-menu"
                id="stack-new-card-menu"
                v-if="isNewCardMenuVisible">
            <!-- <div class="stack-new-card-menu-header">
                <p>New card</p>
            </div>
            <hr class="stack-new-card-menu-header-line">   -->

            <div class="stack-new-card-menu-cards">
                <button class="stack-new-card-menu-card" 
                            v-for="newCard in newCards" 
                            :key="newCard.name"
                            :disabled="!newCard.available"
                            @click="createNewCard(newCard)"
                            >
                    <div class="stack-new-card-menu-card-primary">
                        <img class="stack-new-card-menu-card-primary-icon" 
                            :src="newCard.icon">
                        
                        <p class="stack-new-card-menu-card-primary-title">
                            {{ newCard.title }}
                        </p>
                    </div>

                    <div class="stack-new-card-menu-card-secondary">
                        <p class="stack-new-card-menu-card-secondary-description">
                            {{ newCard.description }}
                        </p>
                    </div>
                
                </button>    
                    


                

            </div>
        </div>  

        <div class="stack-controls-wrapper">
            
            <div class="stack-controls">
                <button class="stack-controls-common stack-controls-toggle" id= "stack-controls-toggle" @click="toggleCardStack">{{ toggleButtonText }}</button>
                <button class="stack-controls-common stack-controls-move">Move</button>
                <button class="stack-controls-common stack-controls-add" @click="toggleNewCardMenu">
                    <img src="../assets/common/add.svg">
                </button>
            </div>
        </div>

            
    </div>
</template>



<script>
import Card from './Card.vue';
import interact from 'interactjs';


// import ImageViewer from './programs/ImageViewer.vue'
// import VideoViewer from './programs/VideoViewer.vue'
// import PdfViewer from './programs/PdfViewer.vue'
// import TextEditor from './programs/TextEditor.vue'



export default {
    components: {
        Card,
        // ImageViewer,
        // VideoViewer,
        // PdfViewer,
        // TextEditor,

    },

    props: {
        stackData: {
            required: true,
            type: Object,
        }
    },

    data() {
        return {
            // cards: this.stackData.cards,
            
            // stackSettings: {
            //     cardGap: this.calculateCardGap(),
            // },
            // boundingRect: null,

            controls: {
                toggleActive: true, 
                toggleExpand: true
            },

            cardContent: [],

            cardsHaveFocus: true,

            isNewCardMenuVisible: false,

            newCards: [              
                {
                    "type": "whiteboard",
                    "program": "whiteboard",
                    "available": true,
                    "title": "Draw",
                    "icon": require('@/assets/cards/icons/whiteboard.svg'),
                    "description": "Create a whiteboard"
                },                 
                {
                    "type": "pdf",
                    "program": "pdfviewer",
                    "available": true,
                    "title": "PDF",
                    "icon": require('@/assets/cards/icons/pdf.svg'),
                    "description": "Upload a PDF from your device"
                },      
                {
                    "type": "youtube",
                    "program": "youtubeplayer",
                    "available": true,
                    "title": "Video",
                    "icon": require('@/assets/cards/icons/youtube.svg'),
                    "description": "Play a video from YouTube"
                },                
                {
                    "type": "text",
                    "program": "texteditor",
                    "available": true,
                    "title": "Notes",
                    "icon": require('@/assets/cards/icons/text.svg'),
                    "description": "Create a note with a text editor"
                },                
                {
                    "type": "url",
                    "program": "list",
                    "title": "URL",
                    "available": true,
                    "icon": require('@/assets/cards/icons/link.svg'),
                    "description": "Create a list of URLs"
                },                
                {
                    "type": "image",
                    "program": "gallery",
                    "available": true,
                    "title": "Image",
                    "icon": require('@/assets/cards/icons/image.svg'),
                    "description": "Upload images from your device"
                },                  
                {
                    "type": "todo",
                    "program": "list",
                    "available": true,
                    "title": "Todo",
                    "icon": require('@/assets/cards/icons/todo.svg'),
                    "description": "Create a todo list"
                },  


            ],

        backdoor: 0
        }
        
    },
    
    
    methods: {

        isCardInStack(index) {
            if ( this.cardsInStack[index] !== null ) {
                return false;
            } else {
                return false;
            }
        },

        generateCards(cards) {
            let crds = []
            for (let index = 0; index < 1; index++) {
                cards.forEach(card => {
                    crds.push(this.cardTemplate(card))
                });
            }
            

            return crds;
        },
        
        initializeInteractJs() {
            var angleScale = {
                angle: 0,
                scale: 1
                }
                // var gestureArea = document.getElementById('gesture-area')
                var scaleElement = document.getElementById('stack')
                var resetTimeout
            interact('.stack-draggable')
            // interact('.stack-controls')
                .draggable({
                    // enable inertial throwing
                    inertia: true,

                    allowFrom: '.stack-controls-move',
                    // keep the element within the area of it's parent
                    modifiers: [
                    // interact.modifiers.restrictRect({
                    //     // restriction: 'parent',
                    //     restriction: document.getElementById('stack-controls'),
                    //     endOnly: true
                    // })

                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        // restriction: {
                        //     x: 0,
                        //     y: 0,
                        //     width: window.innerWidth - 30,
                        //     height: window.innerHeight - 30,
                        // },
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
                
                .gesturable({
                        listeners: {
                        start (event) {
                            angleScale.angle -= event.angle

                            clearTimeout(resetTimeout)
                            scaleElement.classList.remove('reset')
                        },
                        move (event) {
                            event.target.classList.add("stack-no-delay");
                            
                            // document.body.appendChild(new Text(event.scale))
                            var currentAngle = event.angle + angleScale.angle
                            var currentScale = event.scale * angleScale.scale

                            scaleElement.style.webkitTransform =
                            scaleElement.style.transform =
                            'rotate(' + currentAngle + 'deg)' + 'scale(' + currentScale + ')'

                            // uses the dragMoveListener from the draggable demo above
                            // interact('.stack-draggable').draggable().move(event)
                        },
                        end (event) {
                            angleScale.angle = angleScale.angle + event.angle
                            angleScale.scale = angleScale.scale * event.scale

                            // resetTimeout = setTimeout(reset, 1000)
                            scaleElement.classList.add('reset')
                            event.target.classList.remove("stack-no-delay");
                        }
                        }
                    })

                    // function reset () {
                    //     scaleElement.style.webkitTransform =
                    //         scaleElement.style.transform =
                    //         'scale(1)'

                    //     angleScale.angle = 0
                    //     angleScale.scale = 1
                    //     }
        },
        
        stackRearrangeCards(id, stackToBoard) {
            let crds = this.cardsInStack
            let card = this.cards.find(c => c.info.id === id)

            if (stackToBoard) {
                // let stackPos = crds.findIndex(c => c.info.id === id)
                // console.log(card.local.display.stackPosition)
                // console.log("assdasd")
                // let crdsAbove = crds.slice(card.local.display.stackPosition);
                // console.log(card)
                // console.log(card.display.position)
                // let crdsAbove = this.cards.slice(card.display.position);
                let crdsAbove = this.cards.filter(c => c.display.position > card.display.position);
                // console.log(crdsAbove)
                
                crdsAbove.forEach(card => {
                    this.cardUpdatedItself(card.info.id, 'local.display.stackPosition', card.local.display.stackPosition - 1)
                    // console.log("zhege")
                });

                if (this.cardsOnBoard.length === 0) {
                    this.controls.toggleExpand = false;
                }
            } else {
                let crdsAbove = crds.filter(c => c.display.position > card.display.position)
                let crdsBelow = crds.filter(c => c.display.position < card.display.position)
                // console.log("STACK", crds)
                // console.log("ABOVE", crdsAbove)
                // console.log("BELOW", crdsBelow)

                if (crdsAbove.length > 0) {
                    let cardAbove = crdsAbove.reduce((min, card) => min.local.display.stackPosition < card.local.display.stackPosition ? min : card)
                    this.cardUpdatedItself(card.info.id, 'local.display.stackPosition', cardAbove.local.display.stackPosition)
                    
                    
                    crdsAbove.forEach(card => {
                        this.cardUpdatedItself(card.info.id, 'local.display.stackPosition', card.local.display.stackPosition + 1)
                    }) 


                } else if (crdsBelow.length > 0) {
                    let cardBelow = crdsBelow.reduce((max, card) => max.local.display.stackPosition > card.local.display.stackPosition ? max : card)
                    this.cardUpdatedItself(card.info.id, 'local.display.stackPosition', cardBelow.local.display.stackPosition + 1)
                } else {
                    this.cardUpdatedItself(card.info.id, 'local.display.stackPosition', 0)
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
                if (this.isNewCardMenuVisible) this.toggleNewCardMenu()
                
                document.getElementById("stack-controls-toggle").style.opacity = 0.5;
                
                
                this.controls.toggleActive = false;
                
                // let cards = []

                // if (onlyOpen) {
                //     let cards = this.cardsInStack.filter(c => c.display.open)
                // } else {
                    let cards = this.cardsInStack.length < this.stackData.cards.length
                            ? this.cardsOnBoard
                            // ? this.$children
                            : this.cardsInStack
                // }


                // console.log(cards)
                
                cards.forEach((card, index) => {
                    // setTimeout(() => {
                    //         // console.log(card)
                    //         requestAnimationFrame(function() {
                    //             card.onCardMouseUp()
                    //             // if (!onlyOpen) this.cardUpdatedItself()
                    //     })
                    // }, 100 + 100*index); 
                    // console.log(card)
                    setTimeout(() => {
                        // console.log(card.display.open)
                        this.cardUpdatedItself(card.info.id, 'display.open', !card.display.open)
                        // console.log(card.display.open)

                    }, 100 + 100*(index));
                    

                
                });
                                    
                
                setTimeout(() => {
                    document.getElementById("stack-controls-toggle").style.opacity = 1;
                    this.controls.toggleActive = true;
                    this.controls.toggleExpand = !this.controls.toggleExpand;

                }, 1000 + 200*cards.length);
        },

        generateDimensions(d) {
            switch (d) {
                case "x":
                    return  100;
                
                case "y":
                    return  100;
                    
                case "width":
                    return  260 + Math.floor(Math.random() * 500 );
                    
                case "height":
                    return  260 + Math.floor(Math.random() * 200 );
            
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
        },

        cardsSetFocus(cardId, start) {
            // let otherCards = this.$children.filter(card => card.id != cardId)
            // let crds = this.$children
            
            if (start) {
                this.cardsHaveFocus = false
                // crds.forEach(card => {
                //     card.hasFocus = false;
                // });
            } else {
                this.cardsHaveFocus = true
                // crds.forEach(card => {
                //     card.hasFocus = true;
                // });
            }
        },
        
        cardBringForward(id) {
            // console.log( "1", this.cards)
            let card = this.cards.find(c => c.info.id === id)
            let originalIndex = card.display.position
            let higherCardsOnBoard = this.cardsOnBoard.filter(card => card.display.position > originalIndex)
            
            if (!higherCardsOnBoard.length) {
                return null
            }

            let highestCardOnBoard = higherCardsOnBoard[higherCardsOnBoard.length - 1]
            let newIndex = highestCardOnBoard.display.position
            // console.log(newIndex)
            
            let cardsToBeAdjusted = this.cards.filter(c => (c.display.position <= newIndex && c.display.position > originalIndex))           
            cardsToBeAdjusted.forEach((c) => {
                this.cardUpdatedItself(c.info.id, 'display.position', c.display.position - 1)
            });
            
            this.cardUpdatedItself(card.info.id, 'display.position', newIndex)
        },
                
        cardProgramUpdatedContent(programName, updatedContent, cardId) {
            this.$emit("stackCardProgramUpdatedContent", programName, updatedContent, cardId)

        },

        cardProgramCreatedContent(programName, mainContent, cardId) {
            this.$emit("stackCardProgramCreatedContent", programName, mainContent, cardId)

        },

        cardProgramDeletedContent(programName, deletedContent, cardId) {
            this.$emit("stackCardProgramDeletedContent", programName, deletedContent, cardId)

        },

        // cardProgramNameToKey(program) {
        //     switch (program) {            
        //         case("todo-list") :
        //             return "todo";                
                
        //         case("url-list") :
        //             return "url";     
                    
        //         case("text-editor") :
        //             return "text";  
        //     }
        // },

        cardUpdatedItself(cardId, path, value) {
            this.$emit("stackCardUpdatedItself", cardId, path, value)
        },

        toggleNewCardMenu() {
            // screenfull.toggle();
            
            if (this.isNewCardMenuVisible) {
                this.$el.querySelector('#stack-cards').style.display = ''
                setTimeout(() => {
                    this.$el.querySelector('#stack-new-card-menu').style.height = 0 + 'px'
                    this.$el.querySelector('#stack-cards').style.opacity = 1

                }, 0)

                setTimeout(() => {
                    this.isNewCardMenuVisible = false
                }, 500);
                
            } else {
                this.isNewCardMenuVisible = true
                setTimeout(() => {
                    this.$el.querySelector('#stack-new-card-menu').style.height = 400 + 'px'
                    this.$el.querySelector('#stack-cards').style.opacity = 0
                }, 0)

                setTimeout(() => {
                    if (this.isNewCardMenuVisible) {
                        this.$el.querySelector('#stack-cards').style.display = 'none'
                    }
                }, 500);
                
            }
            
        },

        createNewCard(card) {
            this.$el.querySelector('#stack-cards').style.display = ''
            setTimeout(() => {
                this.$el.querySelector('#stack-new-card-menu').style.height = 0 + 'px'
                this.$el.querySelector('#stack-cards').style.opacity = 1

            }, 0)

            setTimeout(() => {
                this.isNewCardMenuVisible = false
            }, 500);
            
            this.$emit("createNewCard", card)
            // console.log(this.$children, newCard.info.id)
            
            // console.log(this.stackSettings.cardGap)

            // this.cardsInStack.find(c => c.id === newCard.id).$el.style.bottom = this.stackSettings.cardGap * (this.cardsInStack.length)  + 'px';
            
            
            // this.$nextTick(() => {
            //     this.$children.find(c => c.id === newCard.info.id).onCardMouseUp()
            // })

            this.$children.forEach(element => {
                // console.log(element)
                element.$el.style.bottom = this.stackSettings.cardGap * (element.stackPosition)  + 'px';
            });

        },

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
            // this.stackData
            // console.log(this.$refs)
            // console.log(this.$children)

            // return this.$children.filter(card => card.isInStack)
            //                         .sort(function(a, b) {
            //                             return a.display.position - b.display.position
            //                         })
            return this.stackData.cards.filter(card => !card.display.open)
                                    .sort(function(a, b) {
                                        return a.display.position - b.display.position
                                    });


            // return   this.$refs
            //         ? Object.values(this.$refs)
            //         .filter(c => c[0])
            //         .map(c => c[0])
            //         .filter(c => c.isInStack)
            //         .sort(function(a, b) {
            //             return a.display.position - b.display.position
            //         })
            //         : null
        },
        
        cardsOnBoard() {
            // this.stackData
            // console.log(this.$children)
            
            
            // return this.$children.filter(card => !card.isInStack)
            //                         .sort(function(a, b) {
            //                             return a.display.position - b.display.position
            //                         });

            return this.stackData.cards.filter(card => card.display.open)
                                    .sort(function(a, b) {
                                        return a.display.position - b.display.position
                                    });
            // this.$refs
            // this.stackData
            // console.log(this.$refs)
            // return   this.$refs
            //         ? Object.values(this.$refs)
            //         .filter(c => c[0])
            //         .map(c => c[0])
            //         .filter(card => !card.isInStack)
            //         .sort(function(a, b) {
            //             return a.display.position - b.display.position
            //         })
            //         : null
            // return this.cards
                    
        },
        
        stackSettings() {
            
            let cardCount = this.cards.length;
            // console.log(cardCount)
            // alert(cardCount);
            // alert (cardCount > 45) ? 25 : (50 - cardCount);
            // return (cardCount > 45) ? 25 : (50 - cardCount);
            // cardCount > 45 ? return 25 : return (50 - cardCount);
            // return {cardGap: 50 - this.cards.length * 1};
            // return cardCount <= 45 ? console.log(50 - cardCount) : console.log(5);
            return {
                cardGap: (cardCount <= 45 ? 75 - cardCount - 20 : 7),
                // cardGap: 45,
                cardDimensions: {
                    width: 225,
                    height: 225,
                },
                autoSaveInterval: 5000,
                // cardGap: -100,
            } 
            
        },

        cards() { 
           return this.stackData.cards.filter(c => c).sort(function(a, b) {
                                        return a.display.position - b.display.position
                                    });
        },

        // localCards() {
        //     // return   this.$refs
        //     //         ? Object.values(this.$refs).map(c => c[0])
        //     //         .sort(function(a, b) {
        //     //             return a.display.position - b.display.position
        //     //         })
        //     //         : null
        //     return this.stackData.cards.filter(c => c)
        //                             .sort(function(a, b) {
        //                                 return a.display.position - b.display.position
        //                             });
        // },


        toggleButtonText() {
            return this.cardsOnBoard.length === 0 ? "Open" : "Close";
        },

        // cardLoadContent(index) {
        //     this.cards[index].info
        // }

    },

    watch: {
        // 'stackData.cards': {
        //     // deep: true,
        //     // handler(all) {
        //     handler() {
        //         // console.log(this.$children.find(c => c.cardId === all[all.length -1].info.id))
        //         // console.log("ok")
        //     }
            
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

.stack-controls-wrapper {

    width:280px;
    height: 55px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 99px;
    padding-top: 12px;
    padding-bottom: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    
}

.stack-controls {
    /* position: absolute; */
    /* padding: 5px; */
    height: 100%;
    /* width: 100%; */
    /*height: 100%; */
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.stack-controls-common {
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 16px;
    background-color: white;
    border-radius: 99px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

/* .stack-controls-common:focus{
    outline
} */

.stack-controls-toggle {
    cursor: pointer;

}

.stack-controls-add {
    cursor: pointer;

}

.stack-controls-move:not(:active) {
    cursor: grab;
}

.stack-controls-move:active {
    background-color: lightgreen;
    cursor: grabbing;
    /* box-shadow: none !important; */

}

.stack-controls-common:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.stack-controls-add {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0;
    padding-right: 0;
    height: 31px;
    width: 50px;
    
}

.stack-controls-add img {
    height: 17px;
}

.stack-cards {
    position: relative;
    margin-left: 20px;
    /* bottom: 150px; */
    margin-bottom: -20px;
    padding-bottom: 20px;
    z-index: -20;
    transition: opacity 0.5s;
    /* overflow: hidden; */
}

.stack-new-card-menu {
    /* height: 250px; */
    height: 0px;
    width: 100%;
    /* padding-left: 10px; */
    /* background-color: white; */
    background-color: rgba(0, 0, 0, 0.30);
    position: absolute;
    bottom: 65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    overflow: hidden;
    z-index: 100;
    /* margin-left: 50px; */
    transition: height 0.5s;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);

}

.stack-new-card-menu-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-color: white; */
    /* background-color: rgba(0, 0, 0, 0.30); */

}

.stack-new-card-menu-header p {
    font-size: 25px;
    font-weight: bold;
    color: white;
}

.stack-new-card-menu-header-line {
    width: 100%;
    /* margin-top: 1px; */
    border-bottom: 1px solid black;
}

.stack-new-card-menu-cards {
    /* position: absolute; */
    height: 100%;

    display: flex;
    flex-direction: column;
    /* justify-content: space-evenly; */
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px;
    /* margin-top: 10px; */
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}

.stack-new-card-menu-card {
    display: flex;
    min-height: 75px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 15px;
    user-select: none;
    flex-wrap: nowrap;
    background-color: white;
    transition: box-shadow 0.1s,
                
                ;

}

.stack-new-card-menu-cards::-webkit-scrollbar {
    width: 6px;
}

.stack-new-card-menu-cards::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

.stack-new-card-menu-cards::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

.stack-new-card-menu-cards::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

}

.stack-new-card-menu-card:hover:enabled {
    box-shadow: 0 0 0pt 2pt lightgreen;
    cursor: pointer;

}

.stack-new-card-menu-card:not(:enabled) {
    opacity: 0.4;
    color: black;
}

.stack-new-card-menu-card-primary {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    width: 80px;

}

.stack-new-card-menu-card-primary-icon {
    width: 30px;
}

.stack-new-card-menu-card-primary-title {
    font-weight: bold;
    margin-top: -2px;
    font-size: 16px;

}

.stack-new-card-menu-card-secondary {
    width: 100%;
    margin-left: 15px;
    /* padding-left: 10px; */
}

.stack-new-card-menu-card-secondary-description {
    text-align: center;
    font-size: 16px;
}

</style>
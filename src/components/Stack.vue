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
            <card v-for="(card, index) in cards" 
                        :key="card.id" 
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
                        >
            </card>
        </div>

        


        <div class="stack-controls-wrapper">
            <div class="stack-controls">
                <button class="stack-controls-common stack-controls-toggle" id= "stack-controls-toggle" @click="toggleCardStack">{{ toggleButtonText }}</button>
                <button class="stack-controls-common stack-controls-move">Move</button>
                <button class="stack-controls-common stack-controls-add">
                    <img src="../assets/stack/controls/add.svg">
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

            cardContent: [],

            cardsHaveFocus: true,
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

                        "display": {
                            "program": "single"
                        },

                        "content": [
                            {
                                "meta": {},
                                "file": {
                                    "url": 'http://docs.google.com/gview?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true',
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

                        "display": {
                            "program": "gallery"
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

                        "display": {
                            "program": "texteditor"
                        },

                        "content": [
                            {
                                "meta": {},
                                "text": [{"insert":"Hello Wld!"},{"attributes":{"align":"center"},"insert":"\n\n"},{"attributes":{"underline":true,"bold":true},"insert":"OOOK"},{"attributes":{"align":"center"},"insert":"\n"}]
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
                            "type": "todo", 
                            "title": "Todo List"
                        },

                        "display": {
                            "program": "list"
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "todo": {
                                    
                                    "body": "First todo",
                                    "position": 1,
                                    "completed_at": null
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "todo": {
                                    
                                    "body": "Second todo",
                                    "position": 2,
                                    "completed_at": null
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "todo": {
                                    
                                    "body": "Third todo",
                                    "position": 3,
                                    "completed_at": null
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
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
                            "type": "url", 
                            "title": "Url List"
                        },

                        "display": {
                            "program": "list"
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "url": {
                                    "path": "https://www.nasa.gov/mission_pages/hubble/main/index.html",
                                    "position": 1,
                                    "ico": null,
                                    "title": null,
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "url": {
                                    
                                    "path": "http://www.esa.int/",
                                    "position": 2,
                                    "ico": null,
                                    "title": null,                                    
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "url": {
                                    
                                    "path": "https://www.youtube.com/user/destinws2",
                                    "position": 3,
                                    "ico": null,
                                    "title": null,                                    
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "url": {
                                    
                                    "path": "https://codepen.io/chriscoyier/pen/uCwfB",
                                    "position": 3,
                                    "ico": null,
                                    "title": null,                                   
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                        ],

                    },
                )
            
            }
            return cards;
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
        
        stackRearrangeCards(index, stackToBoard) {
            let crds = this.cardsInStack
            // console.log(crds)
            if (stackToBoard) {
                let bottomCardIndex = crds.findIndex(function(card) {
                    return card.indexAsData === index;
                });
                
                let crdsAbove = crds.slice(bottomCardIndex, crds.length);
                
                crdsAbove.forEach(element => {
                    element.$el.style.bottom = this.stackSettings.cardGap * (element.stackPosition - 1)  + 'px';

                    element.stackPosition -= 1
                });

                if (this.cardsOnBoard.length === 0) {
                    this.controls.toggleExpand = false;
                }
            } else {
                
                let cardAbovePosition = crds.findIndex(function(card) {
                    return card.indexAsData > index;
                });

                if (cardAbovePosition !== -1) {
                    
                    let crdsAbove = crds.slice(cardAbovePosition, crds.length);
                    // console.log(crdsAbove)
                    crdsAbove.forEach(element => {
                        element.$el.style.bottom = this.stackSettings.cardGap * (element.stackPosition + 1)  + 'px';
                        element.stackPosition += 1
                        // this.$children[index].setStackPosition(cardAbovePosition);
                        // element.setStackPosition(cardAbovePosition);
                    });
                    // console.log(cardAbovePosition)
                    this.$children.filter(card => card.indexAsData === index)[0].setStackPosition(cardAbovePosition)

                } else {
                    // console.log(this.$children[index])
                    // console.log(this.$children.filter(card => card.indexAsData === index)[0])
                    this.$children.filter(card => card.indexAsData === index)[0].setStackPosition(crds.length);
                }

                if (this.cardsOnBoard.length === 1) {
                    
                    this.controls.toggleExpand = true;
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
                
                let cards = this.cardsInStack.length < this.$children.length
                            ? this.cardsOnBoard.slice().reverse()
                            // ? this.$children
                            : this.cardsInStack.slice().reverse();
                
                
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
                    // this.controls.toggleExpand = !this.controls.toggleExpand;

                }, 700 + 100*cards.length);

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
        
        cardBringForward(crd) {
            
            let originalIndex = crd.indexAsData
            let higherCardsOnBoard = this.cardsOnBoard.filter(card => card.indexAsData > originalIndex)
            
            if (!higherCardsOnBoard.length) {
                return null
            }

            let highestCardOnBoard = higherCardsOnBoard[higherCardsOnBoard.length - 1]


            // let higherCardsInStack = this.cardsInStack.filter(card => card.index > highestCardOnBoard.index)

            // let lowerCardsOnBoard = 

            let newIndex = highestCardOnBoard.indexAsData

            let cardsToBeAdjusted = this.$children.filter(card => (card.indexAsData <= newIndex && card.indexAsData > originalIndex))

            crd.indexAsData = newIndex;
            // crd.stackPosition = newIndex;

            // console.log(cardsToBeAdjusted)
            // console.log(higherCardsOnBoard)

            cardsToBeAdjusted.forEach((card) => {
                // alert(index)
                card.indexAsData--
                // card.stackPosition = card.indexAsData -1 
            });



        },
                
        cardProgramUpdatedContent(programName, updatedContent, cardId) {
            console.log("UPDATE", programName, updatedContent, cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))
            let contentKey = this.cardProgramNameToKey(programName)
            // console.log(contentKey)

            this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id)[contentKey] = updatedContent[contentKey]

        },

        cardProgramCreatedContent(programName, cardId) {
            // let contentKey = this.cardProgramNameToKey(programName)
            console.log("CREATE", "FROM", programName, "CARD", cardId)
            // console.log(contentKey, programName, newContent, cardId)
            let newContent = this.contentTemplate(programName)
            // Backend communication
            // let contentMap = new Map()
            console.log("RESULT", newContent)
            this.cards.find(c => c.info.id === cardId).content.push(newContent)
            // this.cards.find(c => c.info.id === cardId).content.push(
            //     {
            //         "id": Math.floor(Math.random()*1000),
            //         newContent,
            //         "meta": null
                    
            //     }
            // )


        },

        cardProgramDeletedContent(programName, deletedContent, cardId) {
            console.log("DELETE", programName, deletedContent, cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === deletedContent.id))
            // let contentKey = this.cardProgramNameToKey(programName)
            // console.log(contentKey)
            let c = this.cards.find(c => c.info.id === cardId).content
            let i = c.findIndex(c => c.id === deletedContent.id)
            c.splice(i, 1)

        },

        cardProgramNameToKey(program) {
            switch (program) {            
                case("todo-list") :
                    return "todo";                
                
                case("url-list") :
                    return "url";     
                    
                case("text-editor") :
                    return "text";  
            }
        },

        contentTemplate(type) {
            switch (type) {
                case("image-component") : {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000 ),
                        "meta": {},
                        "file": {
                            "url": 'https://nasa.gov',
                            "name": "NFX"
                        }    
                    }
                    return obj

                }            
                
                case("todo-list") : {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000 ),
                        "isEditing": false,
                        "meta": {},
                        "todo": {
                            "body": 'New todo',
                        }    
                    }
                    return obj
                }
                    
                case("url-list"): {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000 ),
                        "isEditing": false,
                        "meta": {},
                        "url": {
                            "path": '',
                            "position": 1,
                            "ico": 'https://icons.iconarchive.com/icons/treetog/junior/128/earth-icon.png',
                            "title": 'Right click to edit',
                        }    
                    }
                    
                    return obj;
                }  
                    
                case("text-editor") :
                    return "text";  
            }
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
            return this.$children.filter(card => card.isInStack)
                                    .sort(function(a, b) {
                                        return a.indexAsData - b.indexAsData
                                    });
        },
        
        cardsOnBoard() {
            return this.$children.filter(card => !card.isInStack)
                                    .sort(function(a, b) {
                                        return a.indexAsData - b.indexAsData
                                    });
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
                },
                autoSaveInterval: 5000,
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

.stack-controls-wrapper {

    width:280px;
    height: 55px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 99px;
    padding-top: 12px;
    padding-bottom: 12px;
    box-sizing: border-box;
    /* display: flex;
    flex-direction: column; */
    
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

.stack-controls-move {
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
    /* overflow: hidden; */
}

</style>

.stack-controls {
    /* position: absolute; */ 
    /* margin-top: 30px; */
    /* margin-left: -25px; */
    width: 260px;
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

.stack-controls-add-wrapper {
    max-height: 30px;
    min-height: 30px;
    max-width: 30px;
    min-width: 30px;
    padding: 0;
    /* padding-bottom: 10px; */
    /* padding-bottom: 15px; */
    /* padding: 5px 5px 5px 5px !important; */

}

.stack-controls-add {
    font-size: 30px;
    padding-bottom: 20px;
    width: 100%;
    height: 100%;
}
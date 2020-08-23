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

            cardLoadContent: false,

            cardContent: [],

            cardsHaveFocus: true,

            isNewCardMenuVisible: false,

            newCards: [
                {
                    "type": "image",
                    "available": true,
                    "title": "Image",
                    "icon": require('@/assets/cards/icons/image.svg'),
                    "description": "Upload images from your device"
                },                
                {
                    "type": "embed",
                    "program": "youtube",
                    "available": true,
                    "title": "Video",
                    "icon": require('@/assets/cards/icons/youtube.svg'),
                    "description": "Play a video from YouTube"
                },                
                {
                    "type": "text",
                    "available": true,
                    "title": "Notes",
                    "icon": require('@/assets/cards/icons/text.svg'),
                    "description": "Create a note with a text editor"
                },                
                {
                    "type": "todo",
                    "available": true,
                    "title": "Todo",
                    "icon": require('@/assets/cards/icons/todo.svg'),
                    "description": "Create a todo list"
                },                
                {
                    "type": "url",
                    "title": "URL",
                    "available": true,
                    "icon": require('@/assets/cards/icons/link.svg'),
                    "description": "Create a list of URLs"
                },                
                {
                    "type": "pdf",
                    "available": true,
                    "title": "PDF",
                    "icon": require('@/assets/cards/icons/pdf.svg'),
                    "description": "Upload a PDF from your device"
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
                if (this.isNewCardMenuVisible) this.toggleNewCardMenu()
                
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
            console.log("UPDATE", programName, updatedContent, "CARD", cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))
            let contentKey = this.cardProgramNameToKey(programName)
            // console.log(contentKey)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))

            this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id)[contentKey] = updatedContent[contentKey]

        },

        cardProgramCreatedContent(programName, mainContent, cardId) {
            console.log("CREATE", "FROM", programName, "MAIN CONTENT", mainContent ?? null, "CARD", cardId)
            let newContent = this.contentTemplate(programName, mainContent ?? null)
            
            console.log("RESULT", newContent)
            this.cards.find(c => c.info.id === cardId).content.push(newContent)

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

        contentTemplate(type, mainContent) {
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
                            "path": mainContent ?? '',
                            "position": 1,
                            "ico": mainContent ? null : 'https://icons.iconarchive.com/icons/treetog/junior/128/earth-icon.png',
                            "title": mainContent ? null : 'Right click to edit',
                        }    
                    }
                    
                    return obj;
                }  
                    
                case("text-editor") :
                    return "text";  

                case("youtube-player"): {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000 ),
                        "isEditing": false,
                        "meta": {},
                        "url": {
                            "path": mainContent ?? '',
                        }    
                    }
                    
                    return obj;
                }
            }
        },

        cardUpdatedItself(cardId, updatedPropertyType, updatedPropertyKey, updatedPropertyValue) {
            console.log("UPDATE", updatedPropertyType, updatedPropertyKey, "TO \"", updatedPropertyValue, "\" CARD", cardId)
            this.cards.find(c => c.info.id === cardId)[updatedPropertyType][updatedPropertyKey] = updatedPropertyValue
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

        cardTemplate(card) {
            switch(card.info.type) {
                case("image"):
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 777,
                                "height": 550,
                            },
                            "type": "image", 
                            "title": "Andromeda"
                        },

                        "display": {
                            "program": "gallery",
                            "icon": require('@/assets/cards/icons/image.svg'),

                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*1000),
                                "meta": {},
                                "file": {
                                    "url": 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/800px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
                                    "name": "The Andromeda Galaxy"
                                }

                            },


                        ]
                    }

                case("todo"): 
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 340,
                            },
                            "type": "todo", 
                            "title": "Todo List"
                        },

                        "display": {
                            "program": "list",
                            "icon": require('@/assets/cards/icons/todo.svg'),

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
                        ],

                    }

                case("url"):
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 710,
                                "height": 260,
                            },
                            "type": "url", 
                            "title": "Url List"
                        },

                        "display": {
                            "program": "list",
                            "icon": require('@/assets/cards/icons/link.svg'),
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*1000),
                                "isEditing": false,
                                "url": {
                                    "path": 'layrstack.com',
                                    "position": 1,
                                    "ico": null,
                                    "title": null,
                                },
                                "meta": {
                                    "created_at": "2020-07-20T16:59:14.000000Z",
                                    "updated_at": "2020-07-20T16:59:14.000000Z"
                                }
                            },
                        ],

                    }

                case("text"):
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 320,
                            },
                            "type": "text", 
                            "title": "Text editor"
                        },

                        "display": {
                            "program": "texteditor",
                            "icon": require('@/assets/cards/icons/text.svg'),
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*1000),
                                "meta": {},
                                "text": [{"insert":"Hello World!"},{"insert":"\n\n"}]
                            }
                        ],

                    }

                
                case("pdf"):
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*1000),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 490,
                                "height": 710,
                            },
                            "type": "pdf", 
                            "title": "NFX"
                        },

                        "display": {
                            "program": "single",
                            "icon": require('@/assets/cards/icons/pdf.svg'),

                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*1000),
                                "meta": {},
                                "file": {
                                    "url": 'http://docs.google.com/gview?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true',
                                    "name": "NFX"
                                }    
                            }
                        ],

                    }
                case("embed"):
                    switch(card.display.program) {
                        case("youtube"):                            
                            return {
                                "info": {
                                    "id": Math.floor(Math.random()*1000),
                                    "dimensions": {
                                        "x": this.generateDimensions('x'),
                                        "y": this.generateDimensions('y'),
                                        "width": 580,
                                        "height": 380,
                                    },
                                    "type": "embed", 
                                    "title": "YouTube video"
                                },

                                "display": {
                                    "program": "youtube",
                                    "icon": require('@/assets/cards/icons/youtube.svg'),

                                },

                                "content": [
                                    // {
                                    //     "id": Math.floor(Math.random()*1000),
                                    //     "meta": {},
                                    //     "url": {
                                    //         "path": 'https://www.youtube.com/watch?v=0pZ8PVRauDU',
                                    //         "name": "NFX"
                                    //     }    
                                    // }
                                ],

                            }
                        }
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
            this.backdoor
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
           return this.stackData.cards
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
<template>
    <div id="layr">
        <!-- <debug></debug> -->
        <div class="menu" id="menu">
            <div class="menu-container" id="menu-container">

                <div class="menu-content">

                    <div class="menu-content-controls-primary">
                        <button class="menu-content-controls-primary-boards menu-content-buttons menu-content-buttons-primary" 
                                    @click="menuBoardsClick" 
                                    id="menu-boards-button">Boards</button>
                        <button class="menu-content-controls-primary-stacks menu-content-buttons menu-content-buttons-primary">Stacks</button>
                    </div>
                    

                    <div class="menu-content-board-title">
                        <!-- <hr class="menu-content-line-left">     -->
                        <h1 v-if="!boardDataLoaded">Loading...</h1>
                        <h1 v-if="boardDataLoaded">{{ currentBoard.info.title }}</h1>
                        <!-- <hr class="menu-content-line-right"> -->
                    </div>
                    <div class="menu-content-controls-secondary">
                        <button class="menu-content-controls-secondary-settings menu-content-buttons menu-content-buttons-secondary"
                                    @click="settingsMenu"
                                    >
                                Settings
                        </button>
                        <button class="menu-content-controls-secondary-help menu-content-buttons menu-content-buttons-secondary">Help</button>
                        <!-- <button class="menu-content-controls-secondary-share menu-content-buttons menu-content-buttons-secondary">Share</button> -->

                    </div>
                </div>

                <div class="sub-menu-container" id="sub-menu-container">
                    <div class="sub-menu" id="sub-menu" v-if="subMenu !== null">
                        <div class="sub-menu-content">
                            <!-- <component :is="subMenuComponent"></component> -->
                            <component :is="subMenu" 
                                        v-bind="subMenuContent"
                                        @subMenuBoardClicked="openBoard"
                                        @subMenuBoardNewBoard="createNewBoard"
                                        >
                                        
                            </component>
                        </div>
                    </div>

                </div>

     

            </div>

            
            <div class="menu-pull" id="menu-pull"
                    @click="menuPullClick">
                <hr class="menu-pull-line">

            </div>
        </div>
        <div class="board" id="board">
            
            <stack :stackData="stackData" 
                    v-if="stackDataLoaded"
                    @createNewCard="createNewCard"
                    :ref="'stack'"
                    @stackCardProgramUpdatedContent="stackCardProgramUpdatedContent"
                    @stackCardProgramCreatedContent="stackCardProgramCreatedContent"
                    @stackCardProgramDeletedContent="stackCardProgramDeletedContent"
                    @stackCardUpdatedItself="stackCardUpdatedItself"
                        >
            
            </stack>


                <!-- <p>Stack bottom</p> -->

            <div class="cards" id="cards"></div>

        </div>
           
    </div>
</template>

<script>
import Stack from './components/Stack.vue'
import screenfull from 'screenfull'
import { loremIpsum } from "lorem-ipsum";

export default {
    
    name: 'layr',


    components: {
        Stack
    },

    data() {
        return {
            isMenuOpen: true,
            isFullscreen: false,
            subMenu: null,
            boards: null,
            currentBoardId: 0,
            boardDataLoaded: false,
            stackDataLoaded: false,
            // stackData: null,
        }
    },

    computed: {
        subMenuContent() {
            if (this.subMenu === "menu-boards") {
                return {
                    boards: this.boards
                } 
            } else {
                return null
            }
        },
        
        currentBoard() {
            return this.boards.find(b => b.info.id === this.currentBoardId)
        },

        stackData() {
            return this.currentBoard.stacks[0]
        }

    },

    mounted() {
        this.boards = this.generateBoards(3)
        this.openBoard(this.boards[0].info.id)


    },

    methods: {
        menuPullClick() {
            // alert('click')
            if (this.isMenuOpen) {
                // this.$nextTick(() => {
                if (this.subMenu === null) {
                    this.$el.querySelector('#menu-container').style["max-height"] = 0 + 'px'
                    this.$el.querySelector('#menu-pull').style["background-color"] = "rgba(0, 0, 0, 0.15)"

                    this.isMenuOpen = false
                } else {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                    this.$el.querySelector('#menu-boards-button').style["background-color"] = ""

                    setTimeout(() => {
                        this.subMenu = null
                    }, 400);

                }

                // })
            } else {
                // this.$nextTick(() => {
                    this.$el.querySelector('#menu-container').style["max-height"] = 300 + 'px'
                    this.$el.querySelector('#menu-pull').style["background-color"] = "rgba(0, 0, 0, 0.45)"
                    this.isMenuOpen = true
                // })
            }

        },

        settingsMenu() {
            // if (this.isFullscreen) {
            //     this.$nextTick(() => {
            //         this.$el.querySelector('#menu').style.height = 50 + 'px'
            //         this.isFullscreen = false
            //     })
            // } else {
            //     this.$nextTick(() => {
            //         this.$el.querySelector('#menu').style.height = 70 + 'px'
            //         this.isFullscreen = true

            //     })
            // }
            screenfull.toggle(); 
        },

        menuBoardsClick() {
            if (this.subMenu === "menu-boards") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                this.$el.querySelector('#menu-boards-button').style["background-color"] = ""
                
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                this.subMenu = "menu-boards"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 400 + 'px'
                    this.$el.querySelector('#menu-boards-button').style["background-color"] = "lightgreen"

                    
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)

                

            }
            

        },

        generateBoards(count) {
            let boards = []
            for (let index = 0; index < count; index++) {
                let board = {
                    info: {
                        id: Math.floor(Math.random() * 10000),
                        title: loremIpsum(
                                {
                                    count: 4, 
                                    units: "words"
                                }
                            )
                    },
                    stacks: [
                        {
                            info: {
                                id: Math.floor(Math.random() * 10000),
                            },
                            cards: this.generateCards(
                [
                    {
                        "info" : {
                            "type": "image"
                        },
                        "display": {
                            "program": "gallery"
                        }
                    },

                    {
                        "info" : {
                            "type": "embed"
                        },
                        "display": {
                            "program": "youtube"
                        }
                    },
                    {
                        "info" : {
                            "type": "text"
                        },
                        "display": {
                            "program": "text-editor"
                        }
                    },

                    {
                        "info" : {
                            "type": "todo"
                        },
                        "display": {
                            "program": "todo-list"
                        }
                    },

                    {
                        "info" : {
                            "type": "url"
                        },
                        "display": {
                            "program": "url-list"
                        }
                    },

                    {
                        "info" : {
                            "type": "pdf"
                        },
                        "display": {
                            "program": "pdf-viewer"
                        }
                    },

                ]
                ),
                        }
                        
                    ], 
                }

                boards.push(board)
                
            }
            return boards;
        },

        generateCards(cards) {
            let crds = []
            for (let index = 0; index < 1; index++) {
                cards.forEach(card => {
                    crds.push(this.cardTemplate(card))
                });
            }
            

            return this.shuffleArray(crds);
        },

        cardTemplate(card) {
            switch(card.info.type) {
                case("image"):
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*10000),

                            "type": "image", 
                            "title": "Andromeda"
                        },

                        "display": {
                            "program": "gallery",
                            "icon": require('@/assets/cards/icons/image.svg'),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 777,
                                "height": 550,
                            },
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
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
                            "id": Math.floor(Math.random()*10000),

                            "type": "todo", 
                            "title": "Todo List"
                        },

                        "display": {
                            "program": "list",
                            "icon": require('@/assets/cards/icons/todo.svg'),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 340,
                            },
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
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
                            "id": Math.floor(Math.random()*10000),

                            "type": "url", 
                            "title": "Url List"
                        },

                        "display": {
                            "program": "list",
                            "icon": require('@/assets/cards/icons/link.svg'),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 710,
                                "height": 260,
                            },                        
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
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
                            "id": Math.floor(Math.random()*10000),

                            "type": "text", 
                            "title": "Text editor"
                        },

                        "display": {
                            "program": "texteditor",
                            "icon": require('@/assets/cards/icons/text.svg'),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 320,
                            },                        
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
                                "meta": {},
                                "text": [{"insert":"Hello World!"},{"insert":"\n\n"}]
                            }
                        ],

                    }

                
                case("pdf"):
                    return {
                        "info": {
                            "id": Math.floor(Math.random()*10000),

                            "type": "pdf", 
                            "title": "NFX"
                        },

                        "display": {
                            "program": "single",
                            "icon": require('@/assets/cards/icons/pdf.svg'),
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 490,
                                "height": 710,
                            },
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
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
                                    "id": Math.floor(Math.random()*10000),

                                    "type": "embed", 
                                    "title": "YouTube video"
                                },

                                "display": {
                                    "program": "youtube",
                                    "icon": require('@/assets/cards/icons/youtube.svg'),
                                    "dimensions": {
                                        "x": this.generateDimensions('x'),
                                        "y": this.generateDimensions('y'),
                                        "width": 580,
                                        "height": 380,
                                    },
                                },

                                "content": [
                                    // {
                                    //     "id": Math.floor(Math.random()*10000),
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
        
        openBoard(id) {
            // this.$nextTick(() => {
            //     if (this.$refs.stack.cardsOnBoard.length > 0) {
            //         this.$refs.stack.toggleCardStack()
            //     }
                
            // })
            this.boardDataLoaded = false       

            console.log("API GET RESPONSE for BOARD ID ", id)
                this.$nextTick(() => {
                    if (this.$refs.stack) {
                        console.log(this.$refs.stack.cardsOnBoard.length)
                        console.log(this.$refs.stack.$children)
                        if (this.$refs.stack.cardsOnBoard.length > 0) {
                            this.$refs.stack.toggleCardStack()
                        }                        
                    }
                })
                setTimeout(() => {
                // let board = this.boards.find(b => b.info.id === id)
                
                // this.currentBoard = board
                this.currentBoardId = id
                this.boardDataLoaded = true        

                // this.stackData = board.stacks[0]
                // this.stackData = this.currentBoard.stacks[0]
                this.stackDataLoaded = true


            }, 1200);
        },

        createNewBoard() {
            let board = this.generateBoards(1)[0]
            this.boards.push(board)
            this.openBoard(board.info.id)
        },

        createNewCard(card) {
            let newCard = this.cardTemplate(
                {
                    "info": {
                        "type": card.type
                    },
                    "display": {
                        "program": card.program ?? null
                    }
                }
            )
            this.currentBoard.stacks[0].cards.push(newCard)
            // this.stackData = this.currentBoard.stacks[0]
            
            this.$nextTick(() => {
                this.$refs.stack.$refs["card-" + newCard.info.id][0].onCardMouseUp()
            })
        },

        stackCardProgramUpdatedContent(programName, updatedContent, cardId) {
            console.log("UPDATE", programName, updatedContent, "CARD", cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))
            let contentKey = this.cardProgramNameToKey(programName)
            // console.log(contentKey)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))

            this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id)[contentKey] = updatedContent[contentKey]

        },

        stackCardProgramCreatedContent(programName, mainContent, cardId) {
            console.log("CREATE", "FROM", programName, "MAIN CONTENT", mainContent ?? null, "CARD", cardId)
            let newContent = this.contentTemplate(programName, mainContent ?? null)
            
            console.log("RESULT", newContent)
            this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId).content.push(newContent)

        },

        stackCardProgramDeletedContent(programName, deletedContent, cardId) {
            console.log("DELETE", programName, deletedContent, cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === deletedContent.id))
            // let contentKey = this.cardProgramNameToKey(programName)
            // console.log(contentKey)
            let c = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId).content
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
                        "id": Math.floor(Math.random() * 10000 ),
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
                        "id": Math.floor(Math.random() * 10000 ),
                        "isEditing": false,
                        "meta": {},
                        "todo": {
                            "body": 'New todo',
                            "completed_at": null,
                        }    
                    }
                    return obj
                }
                    
                case("url-list"): {
                    let obj = {
                        "id": Math.floor(Math.random() * 10000 ),
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
                        "id": Math.floor(Math.random() * 10000 ),
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

        stackCardUpdatedItself(cardId, path, value) {
            console.log("UPDATE", path, "TO \"", value, "\" CARD", cardId)
            var card = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId)
            // console.log(card)
            this.setNestedObjectValue(card, path, value)
        },

        setNestedObjectValue(obj, path, value) {
            var schema = obj;  // a moving reference to internal objects within obj
            var pList = path.split('.');
            var len = pList.length;
            for(var i = 0; i < len-1; i++) {
                var elem = pList[i];
                if( !schema[elem] ) schema[elem] = {}
                schema = schema[elem];
            }

            schema[pList[len-1]] = value;
        },

        shuffleArray(array) {
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
            }

    
    
    
    
    
    },


}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

*, html {
    margin: 0;
    padding: 0;
    outline: 0px solid red;
    border: 0;
    /* overflow:hidden; */
    /* appearance: none; */
    /* background: transparent; */
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.board {
    position: fixed;
    background-image: linear-gradient(to left bottom, #32bffd, #00aaff, #0092ff, #0076ff, #1653ff);
    height:100%;
    width:100%;
    overflow:hidden;
    z-index: 100;
}

.cards {
    height:100%;
    width:100%;
    overflow:hidden
}

.menu {
    /* height: 400px; */
    position: fixed;
    /* margin-left: 10px;
    margin-right: 10px; */
    /* overflow:hidden; */

    width: 70%;
    margin-left: auto;
    margin-right: auto;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
}

.menu-container {
    /* max-height: 400px; */
    /* height: 400px; */
    /* position: absolute; */
    overflow: hidden;
    transition: top 0.4s,
                max-height 0.4s
                ;
}

.menu-pull {
    width: 70px;
    height: 19px;
    /* position: relative; */
    /* right: 0px; */
    /* right: 45%; */
    /* right: 0; */
    /* left: 0; */
    margin-left: auto;
    margin-right: auto;
    /* bottom: -19px; */
    background-color: rgba(0, 0, 0, 0.55);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: background-color 0.4s;
    cursor: pointer;
    user-select: none;
}

.menu-pull-line {
    /* width: 20px; */
    width: 70%;
    position:relative;
    margin-left: auto;
    margin-right: auto;
    top:50%;
    border-top: 1px solid white;
}

.menu-content {
    /* flex: 1; */
    height: 50px;
    /* height: 0px; */
    /* overflow: hidden; */

    background-color: yellow;
    /* height: 50px; */
    /* margin-left: 5px; */
    /* margin-right: 5px; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.35);
    border-bottom-left-radius: 10px;
    transition: top 0.4s,
                height 0.4s
                ;
    border-bottom-right-radius: 10px;

    /* justify-content: flex-start; */
    /* justify-content: space-evenly; */
    /* justify-content: space-around; */
}

.menu-content-buttons {
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 16px;
    background-color: white;
    border-radius: 99px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 3px;
    padding-bottom: 3px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

.menu-content-buttons:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.menu-content-buttons-primary {
    margin-right: 15px;
}

.menu-content-buttons-secondary {
    margin-left: 15px;
}

.menu-content-controls-primary {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;
}

.menu-content-controls-secondary {
    margin-right: 20px;
}

.menu-content-board-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.menu-content-board-title h1 {
    color: white;
    font-size: 25px;
    user-select: none;
    /* text-decoration: underline; */
}

.menu-content-line-left {
    border-top: 1px solid white;
    /* margin-top: 5px; */
    /* width: 100%; */
    width: 50px;
    margin-right: 20px;

}

.menu-content-line-right {
    border-top: 1px solid white;
    /* margin-top: 5px; */
    /* width: 50%; */
    width: 50px;
    margin-left: 20px;
}

.sub-menu {
    /* height: 50px; */
    /* height: 0px; */
    /* overflow: hidden; */
    /* background-color: red; */
    /* position: relative; */
    user-select: none;
    margin-top: 0;
    /* height: 0;  */
    padding: 10px;
    /* display: block; */
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.40);
    transition: margin-top 0.2s,
                height 0.4s ease-in-out
                ;
            
}

.sub-menu-container {
    max-height: 0;
    box-sizing: border-box;
    transition:  max-height 0.4s ease-in-out
                ;
    /* padding-top: 5px; */
}

.sub-menu-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

</style>
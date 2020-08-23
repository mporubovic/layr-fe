<template>
    <div id="app">
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
                        <h1>My Board</h1>
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
                    @createNewCard="createNewCard">
            
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
    
    name: 'app',


    components: {
        Stack
    },

    data() {
        return {
            isMenuOpen: true,
            isFullscreen: false,
            subMenu: null,
            boards: this.generateBoards(10),
            currentBoard: null,
            stackDataLoaded: false,
            stackData: null,
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
    },

    mounted() {
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
                        id: Math.floor(Math.random() * 1000),
                        title: loremIpsum(
                                {
                                    count: 5, 
                                    units: "words"
                                }
                            )
                    },
                    stacks: [
                        {
                            info: {
                                id: Math.floor(Math.random() * 1000),
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
            

            return crds;
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
            console.log("API GET RESPONSE for BOARD ID ", id)
            let board = this.boards.find(b => b.info.id === id)
            this.currentBoard = board
            this.stackData = board.stacks[0]
            this.stackDataLoaded = true
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
            this.stackData = this.currentBoard.stacks[0]
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
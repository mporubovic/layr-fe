<template>
    <div id="layr">
        
        <!-- <div class="debug">
            DOMAIN {{ userDomain }} <br>
            SUB {{ userSubdomain }}
        </div> -->
        <div class="guest" v-if="user === 'guest'">
            <p><strong> You are viewing this board as a guest.</strong></p>
            <p>Any changes you make will not be saved.</p>
        </div>


        <div class="menu" id="menu">
            <div class="menu-container" id="menu-container">

                <div class="menu-content">

                    <div class="menu-content-controls-primary">
                        <button class="menu-content-controls-primary-boards menu-content-buttons menu-content-buttons-primary" 
                                    @click="menuLoginClick" 
                                    id="menu-login-button"
                                    v-if="user === null"          
                                    >
                                    Login
                        </button>                        
                        
                        <button class="menu-content-controls-primary-boards menu-content-buttons menu-content-buttons-primary" 
                                    @click="menuBoardsClick" 
                                    id="menu-boards-button"
                                    v-if="userRole === 'student'"          
                                    >
                                    Boards
                        </button>
                        <button class="menu-content-controls-primary-boards menu-content-buttons menu-content-buttons-primary" 
                                    @click="menuStudentsClick" 
                                    id="menu-students-button"
                                    v-if="userRole === 'tutor'"          
                                    >
                                    Students
                        </button>                        
                        <button class="menu-content-controls-primary-boards menu-content-buttons menu-content-buttons-primary" 
                                    @click="menuPersonalClick" 
                                    id="menu-personal-button"
                                    v-if="userRole === 'tutor'"          
                                    >
                                    Personal
                        </button>
                    </div>
                    

                    <div class="menu-content-board-title" id="menu-title"
                        @click.right.prevent="onMenuTitleRightClick"
                        >
                        <!-- <hr class="menu-content-line-left">     -->
                        <!-- <h1 v-if="!boardDataLoaded">Select a board</h1> -->
                        <h1 v-if="!isMenuTitleEditing"
                            @click="onMenuTitleLeftClick"
                            > 
                            {{ menuTitle }}
                        </h1>
                        <input
                            @blur="boardUpdateProperty('info.title', $event.target.value)"
                            @keydown.enter="onMenuTitleInputKeydownEnter($event)"
                            class="menu-title-input"
                            type="text"
                            id="menu-title-input"
                            v-bind:value="currentBoard.info.title"
                            v-if="isMenuTitleEditing"
                            autocomplete="off" 
                        >
                        <!-- <hr class="menu-content-line-right"> -->
                    </div>
                    <div class="menu-content-controls-secondary">
                        <button class="menu-content-controls-secondary-settings menu-content-buttons menu-content-buttons-secondary"
                                    @click="settingsMenu"
                                    >
                                Fullscreen
                        </button>
                        <button class="menu-content-controls-secondary-help menu-content-buttons menu-content-buttons-secondary">Help</button>
                        <!-- <button class="menu-content-controls-secondary-share menu-content-buttons menu-content-buttons-secondary">Share</button> -->

                    </div>
                </div>

                <div class="sub-menu-container" id="sub-menu-container">
                    <div class="sub-menu" id="sub-menu" v-if="subMenu !== null">
                        <div class="sub-menu-content">
                            <!-- <component :is="subMenuComponent"></component> -->
                            <!-- <keep-alive> -->
                                <component :is="subMenu" 
                                            v-bind="subMenuContent"
                                            @subMenuBoardClicked="requestBoard"
                                            @loggedIn="userLoggedIn"
                                            @subdomainHasTitle="setLayrTitle"
                                            >
                                            
                                </component>
                            <!-- </keep-alive> -->
                        </div>
                    </div>

                </div>

     

            </div>

            
            <div class="menu-pull" id="menu-pull"
                    @click="menuPullClick">
                <hr class="menu-pull-line">

            </div>
        </div>
        <div class="board" id="board" @click="boardDivClicked" @scroll.prevent="onBoardDivWheel">
            
            <stack :stackData="stackData" 
                    v-if="stackDataLoaded && currentBoard"
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
            currentBoard: null,
            // currentBoardId: 0,
            boardDataLoaded: false,
            stackDataLoaded: false,
            menuTitle: "Welcome",
            isMenuTitleEditing: false,
            menuTitleTapCount: 0,
            userDomain: null,
            userSubdomain: null,
            students: null,
            user: null,
            zoom: {
                speed: 0.5,
                maxScale: 4,
                minScale: 0.5,
                scale: 1,
                scaleFactor: 0.1,
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                },
                pointer: {
                    x: 0,
                    y: 0
                },
            }
        }
    },

    computed: {
        subMenuContent() {
            if (this.subMenu === "menu-boards") {
                return {
                    // boards: this.boards
                } 
            } else if (this.subMenu === "menu-students") {
                return {
                    students: this.students
                } 
            } else {
                return null
            }
        },
        
        // currentBoard() {
        //     return this.boards.find(b => b.info.id === this.currentBoardId)
        // },

        currentBoardId() {
            return this.currentBoard ? this.currentBoard.info.id : null
        },

        stackData() {
            return this.currentBoard ? this.currentBoard.stacks[0] : []
        },

        // menuTitle() {
        //     return this.currentBoard ? this.currentBoard.info.title : "Loading..."
        // }

        userRole() {
            return this.user ? this.user.role : null
        },

        // cardsCanvas() {
        //     return this.$el.querySelector('#cards').
        // }

    },

    created() {
        window.addEventListener('wheel', event => {
            // event.preventDefault()
            if (event.ctrlKey) {
                event.preventDefault()

                // let scale = this.zoom.scale
                // let scaleFactor = this.zoom.scaleFactor
                
                // let mousex = event.clientX
                // let mousey = event.clientY
                
                // let wheel
                // if (event.deltaY < 0) wheel = 1
                // else wheel = -1

                // let zoom = Math.exp(wheel*scaleFactor)
                // // console.log(this.zoom.scale, dir, scaleFactor)
                // // this.zoom.scale += dir*scaleFactor
                // // console.log(this.zoom.scale)

                // this.zoom.scale = Math.max(this.zoom.minScale, Math.min(this.zoom.maxScale, this.zoom.scale));
                // console.log(this.zoom.scale)

                // let deltaX = (- newPointer.x + oldPointer.x ) / this.zoom.scale
                // let deltaY = (- newPointer.y + oldPointer.y) / this.zoom.scale

                // // this.zoom.pointer = newPointer



                // // let w = this.$el.querySelector('#cards').getBoundingClientRect().width
                // // let h = this.$el.querySelector('#cards').getBoundingClientRect().height

                // this.$el.querySelector('#cards').style["transform-origin"] = `${newPointer.x}px ${newPointer.y}px`
                // // this.$el.querySelector('#cards').style.transform = `translate(${this.zoom.pos.x}px,${this.zoom.pos.y}px) scale(${scale},${scale})`;
                // // this.$nextTick(()=>{
                // //     this.$el.querySelector('#cards').style.transform = `scale(${this.zoom.scale},${this.zoom.scale})`;
                // // })

                // setTimeout(() => {
                //     this.$el.querySelector('#cards').style.transform = `scale(${this.zoom.scale}) translate(${deltaX}px, ${deltaY}px)`;
                    
                // }, 1);
            }
        }, { passive: false })
        // })
    },
    
    mounted() {
        // this.boards = this.generateBoards(4)

        // this.$http.get('/sanctum/csrf-cookie').then(response => {
            // console.log(response)
        let parts = location.hostname.split('.')
        // let secondLevel = domains.slice(-2).join('.');
        // let secondLevel = domains.slice(-2).join('.');
        this.userDomain = location.hostname
        this.userSubdomain = parts[parts.length-3]
        // this.menuBoardsClick()

        if (localStorage.getItem('userLoggedIn')) {
            console.log('User logged in (local storage) verification...')
            this.$http.get('/api/user').then((response) => {
                console.log('Logged in user ', response.data.user)
                this.user = response.data.user
                this.userLoggedIn(this.user)
            }).catch((error) => {
                console.log(error)
                localStorage.clear()
                console.log('Cleared local storage')
                this.loginDropdown()
                
            })
        } else {
            this.loginDropdown()
        }
        
        
        // this.$http.get('/api/boards')
        //     .then(response => {
        //         this.boards = response.data.boards
        //         // this.$set(boards, response.data.boards)
        //         // this.openBoard(this.boards[0].info.id)
        //     } )

        // })
        
        
        


    },

    methods: {
        onBoardDivWheel() {

        },


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
                    this.$el.querySelector('#' + this.subMenu + '-button').style["background-color"] = ""

                    setTimeout(() => {
                        this.subMenu = null
                    }, 400);

                }

                // })
            } else {
                // this.$nextTick(() => {
                    this.$el.querySelector('#menu-container').style["max-height"] = 1500 + 'px'
                    this.$el.querySelector('#menu-pull').style["background-color"] = "rgba(0, 0, 0, 0.45)"
                    this.isMenuOpen = true
                // })
            }

        },

        menuLoginClick() {
            if (this.subMenu === 'menu-login') {
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                this.$el.querySelector('#menu-login-button').style["background-color"] = ""

                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                this.loginDropdown()
            }
        },

        loginDropdown() {
            this.subMenu = "menu-login"
            setTimeout(() => {
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 600 + 'px'
                this.$el.querySelector('#menu-login-button').style["background-color"] = "lightgreen"
                
                this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
            }, 0)
        },

        userLoggedIn(user) {
            this.user = user
            if (this.user.role === 'tutor') {
                // this.loadStudents()
                this.menuStudentsClick()
            } else {
                this.menuBoardsClick()
                this.$el.querySelector('#menu-title').style.opacity = 0
                setTimeout(() => {
                    this.menuTitle = "Select a board"
                    this.$el.querySelector('#menu-title').style.opacity = 1
                    
                }, 1000);
            }
        },

        setLayrTitle(title) {
            this.menuTitle = title
        },

        menuStudentsClick() {
            if (this.subMenu === "menu-students") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                this.$el.querySelector('#menu-students-button').style["background-color"] = ""
                
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                if (this.subMenu === "menu-personal") this.$el.querySelector('#menu-personal-button').style["background-color"] = ""
                this.subMenu = "menu-students"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'
                    this.$el.querySelector('#menu-students-button').style["background-color"] = "lightgreen"

                    
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
            }
        },

        menuPersonalClick() {
            if (this.subMenu === "menu-personal") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                this.$el.querySelector('#menu-personal-button').style["background-color"] = ""
                
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                if (this.subMenu === "menu-students") this.$el.querySelector('#menu-students-button').style["background-color"] = ""

                this.subMenu = "menu-personal"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'
                    this.$el.querySelector('#menu-personal-button').style["background-color"] = "lightgreen"

                    
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
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

        // closeMenu() {
        //     this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
        //     this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
        //     this.$el.querySelector('#menu-boards-button').style["background-color"] = ""
            
        //     setTimeout(() => {
        //         this.subMenu = null
        //     }, 400);
        // },

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
                            "program": "gallery",
                            "position": 0,
                        },
                        "local": {
                            "display": {
                                "stackPosition": 0,
                            }
                        }
                    },

                    {
                        "info" : {
                            "type": "embed"
                        },
                        "display": {
                            "program": "youtube",
                            "position": 1,
                        },
                        "local": {
                            "display": {
                                "stackPosition": 1,
                            }
                        }
                    },
                    {
                        "info" : {
                            "type": "text"
                        },
                        "display": {
                            "program": "text-editor",
                            "position": 2,
                        },
                        "local": {
                            "display": {
                                "stackPosition": 2,
                            }
                        }
                    },

                    {
                        "info" : {
                            "type": "todo"
                        },
                        "display": {
                            "program": "todo-list",
                            "position": 3,
                        },
                        "local": {
                            "display": {
                                "stackPosition": 3,
                            }
                        }
                    },

                    {
                        "info" : {
                            "type": "url"
                        },
                        "display": {
                            "program": "url-list",
                            "position": 4,
                        },
                        "local": {
                            "display": {
                                "stackPosition": 4,
                            }
                        }
                    },

                    {
                        "info" : {
                            "type": "pdf"
                        },
                        "display": {
                            "program": "pdf-viewer",
                            "position": 5,
                        },
                        "local": {
                            "display": {
                                "stackPosition": 5,
                            }
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
                    let c = this.cardTemplate(card)
                    this.setNestedObjectValue(c, 'local.display.stackPosition', card.display.position)
                    crds.push(this.cardTemplate(c))
                });
            }
            

            // return this.shuffleArray(crds);
            return crds
        },

        cardTemplate(card) {
            switch(card.info.type) {
                case("image"):
                    return {
                        "info": {
                            "title": "New Image Card"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/image.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 777,
                                "height": 550,
                            },
                            "program": "gallery",

                        
                        },

                        "content": [
                            // {
                            //     "id": Math.floor(Math.random()*10000),
                            //     "meta": {},
                            //     "file": {
                            //         "url": 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/800px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
                            //         "name": "The Andromeda Galaxy"
                            //     }

                            // },


                        ]
                    }

                case("todo"): 
                    return {
                        "info": {
                            "title": "Todo List"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/todo.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 340,
                            },
                            "program": "list",
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
                                // "isEditing": false,
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
                            "title": "Url List"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/link.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 710,
                                "height": 260,
                            },  
                            "program": "list",
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
                                // "isEditing": false,
                                "url": {
                                    "path": 'placeholder',
                                    "position": 1,
                                    "ico": null,
                                    "name": null,
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
                            "title": "Text editor"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/text.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 320,
                            },  
                            "program": "texteditor",
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
                            "title": "PDF"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/pdf.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 600,
                                "height": 450,
                            },
                            "program": "pdfviewer",
                        },

                        "content": [],

                    }
                case("youtube"):                          
                    return {
                        "info": {
                            "title": "YouTube video"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/youtube.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": this.generateDimensions('x'),
                                "y": this.generateDimensions('y'),
                                "width": 580,
                                "height": 380,
                            },
                            "program": "youtubeplayer",
                        },

                        "content" : [],

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

        requestBoard(id) {
            // this.menuBoardsClick()
            // this.closeMenu()
            // console.log('hello')
            if (!this.userRole) this.user = "guest"

            // this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
            // this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'

            switch (this.subMenu) {
                case 'menu-login':
                    this.menuLoginClick()
                    break
                case 'menu-students':
                    this.menuStudentsClick()
                    break
                case 'menu-boards':
                    this.menuBoardsClick()
                    break
                case 'menu-personal':
                    this.menuPersonalClick()
                    break
            }

            console.log(this.subMenu)
            
            // this.subMenu = null
            


            if (this.currentBoard) this.currentBoard = null

            this.menuTitle = "Loading..."
            // if (this.currentBoardId) this.currentBoardId = null
            this.$http.get('/api/boards/' + id)
                .then(response => {
                    console.log("API GET RESPONSE for BOARD ID ", id)
                    console.log(response.data)
                    // let boardIndex = this.boards.findIndex(b => b.info.id === id)
                    let r = response.data.board
                    this.processRequestedBoard(r)
                    // console.log(response.data.board)
                    // this.boards[boardIndex] = response.data.board
                    // this.$set(this.boards, boardIndex, r)
                    // this.currentBoard = r
                    this.openBoard(r)
                } )           
        },

        processRequestedBoard(board) {
            board.stacks.forEach(stack => {
                stack.cards.forEach(card => {
                    // this.setNestedObjectValue(card, 'local.display.stackPosition', card.display.position)
                    this.processRequestedCards(card)
                });
            });
        },

        processRequestedCards(card) {
            this.setNestedObjectValue(card, 'local.display.stackPosition', card.display.position)
            // if (!card.content) return
            switch (card.info.type) {
                case 'todo':
                    this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/todo.svg'))
                    
                    card.content.forEach(content => {
                        this.setNestedObjectValue(content, 'local.isEditing', false)
                        
                    })
                    
                    break;
                case 'url':
                    this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/link.svg'))

                    card.content.forEach(content => {
                        this.setNestedObjectValue(content, 'local.isEditing', false)
                    })
                    
                    break;

                case 'youtube':
                    this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/youtube.svg'))
                    
                    if (!card.content) card.content = []
                    break
            
                case 'text':
                    this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/text.svg'))

                    break;

                case 'pdf':
                    this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/pdf.svg'))

                    break;

                case 'image':
                    this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/image.svg'))

                    break;
                
                default:
                    break;
            }
        },
        
        openBoard(board) {
            // this.$nextTick(() => {
            //     if (this.$refs.stack.cardsOnBoard.length > 0) {
            //         this.$refs.stack.toggleCardStack()
            //     }
                
            // })
            // this.boardDataLoaded = false       
            // this.stackDataLoaded = false


            // console.log("API GET RESPONSE for BOARD ID ", id)
                // this.$nextTick(() => {
                //     if (this.$refs.stack) {
                // console.log(this.$refs.stack.cardsOnBoard.length)
                // console.log(this.$refs.stack.$refs)
                // console.log(this.$refs.stack.$children)
                // if (this.$refs.stack.cardsOnBoard.length > 0) {
                //     this.$refs.stack.toggleCardStack(true)
                // }                        
                //     }
                // })

                
                // setTimeout(() => {
                // let board = this.boards.find(b => b.info.id === id)
                
                this.currentBoard = board
                // this.currentBoardId = id
                this.boardDataLoaded = true
                this.menuTitle = this.currentBoard.info.title

                
                this.$el.querySelector('#board').style.width = board.settings.dimensions.width + 'px'
                this.$el.querySelector('#board').style.height = board.settings.dimensions.height + 'px'


                // this.stackData = board.stacks[0]
                // this.stackData = this.currentBoard.stacks[0]
                // if (this.$refs.stack) this.$refs.stack.$forceUpdate
                
                this.stackDataLoaded = true


            // }, 100);
        },

        // createNewBoard() {
        //     // let board = this.generateBoards(1)[0]
        //     let title = "New board"
        //     let requestPayload = {
        //         title: title
        //     }

        //     this.$http.post('/api/boards', requestPayload)
        //                 .then(response => {
        //                     let newBoard = response.data.board
        //                     console.log("API BOARD RESPONSE", response.status)
        //                     // this.boards.push(newBoard)
        //                     // this.menuBoardsClick()
        //                     // this.openBoard(newBoard.id)            
        //                 })
        // },

        createNewCard(card) {
            if (this.user === "guest") {
                return
            }
            let newCardDefaults = this.cardTemplate(
                {
                    "info": {
                        "type": card.type
                    },
                    "settings": {
                        "program": card.program,
                        // "position": lastCard.display.position + 1,
                    },
                }
            )            

            let requestPayload = {
                type: card.type,
                // program: card.program,
                stackId: this.currentBoard.stacks[0].info.id,
                open: true,
                title: newCardDefaults.info.title,
                settings: JSON.stringify(newCardDefaults.settings),
                content: newCardDefaults.content,

            }      
            
            console.log(requestPayload)
            let cards = this.currentBoard.stacks[0].cards

            this.$http.post('/api/cards', requestPayload)
                        .then(response => {
                            let newCard = response.data.card
                            if (!newCard.content) newCard.content = []
                            console.log("API CARD RESPONSE", response.status)
                            // this.setNestedObjectValue(newCard, 'local.display.stackPosition', newCard.display.position)
                            this.processRequestedCards(newCard)
                            this.$nextTick(() => {cards.push(newCard)})
                        })
            
            
            // let cards = this.currentBoard.stacks[0].cards
            // let cardsInStack = this.currentBoard.stacks[0].cards.filter(c => !c.display.open)
            // console.log(cardsInStack)
            // let lastCard = cards.reduce((max, card) => max.display.position > card.display.position ? max : card)
            // let lastCardInStack = cardsInStack.reduce((max, card) => max.local.display.stackPosition > card.local.display.stackPosition ? max : card)
            // console.log(lastCardInStack)

            // newCard.display.open = true
            // this.setNestedObjectValue(newCard, 'local.display.stackPosition', lastCardInStack.local.display.stackPosition + 1)
            // console.log(newCard)
            // cards.push(newCard)
            // this.stackData = this.currentBoard.stacks[0]
            
            // this.$nextTick(() => {
            //     // this.$refs.stack.$refs["card-" + newCard.info.id][0].onCardMouseUp()

            // })
        },

        stackCardProgramUpdatedContent(programName, updatedContent, cardId) {
            console.log("UPDATE", programName, updatedContent, "CARD", cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))
            let c = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id)
            
            if (updatedContent.local) {
                if (updatedContent.local.update) {
                    c.local = updatedContent.local
                    if (updatedContent.local.update === "terminate") {
                        c.local.update = null
                        return
                    }
                }
            }

            if (this.user === "guest") {
                return
            }

            let contentKey = this.cardProgramNameToKey(programName)
            let content = {[contentKey]: updatedContent[contentKey]}
            let requestPayload = {
                cardId: cardId,
                content: content
            }
            console.log("REQUEST PAYLOAD", requestPayload)
            this.$http.patch('/api/content/' + updatedContent.id, requestPayload)
                        .then(response => {
                            // let receivedContent = response.data
                            console.log("API CARD RESPONSE", response.status)
                            // card.content.find(c => c.id === tempId).id = response.data[0].id
                            // this.$nextTick(() => {cards.push(newCard)})
                        })

            c[contentKey] = updatedContent[contentKey]
            // console.log("c", c)
            

            // console.log(contentKey)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id))


        },

        stackCardProgramCreatedContent(programName, mainContent, cardId) {
            if (this.user === "guest") {
                return
            }
            console.log("CREATE", "FROM", programName, "MAIN CONTENT", mainContent ?? null, "CARD", cardId)
            // console.log(typeof mainContent[0], mainContent[0] instanceof File)
            let newContent = this.contentTemplate(programName, mainContent ?? null)
            let content
            let requestPayload
            let extraHeaders
            let isFile = mainContent ? mainContent[0] instanceof File : false

            if (isFile) {
                let formData = new FormData()
                formData.append('content', mainContent[0])
                formData.append('cardId', cardId)
                requestPayload = formData
                extraHeaders = {
                    'Content-Type': 'multipart/form-data'
                }
                console.log('formdata', formData.entries())
            } else {
                let contentKey = this.cardProgramNameToKey(programName)
                content = [{[contentKey]: newContent[contentKey]}]
                console.log(newContent)
                requestPayload = {
                    cardId: cardId,
                    content: content
                }
            }
            
            // console.log(newContent)


            console.log("REQUEST PAYLOAD", requestPayload)
            let card = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId)
            // this.processRequestedCards
            if (!isFile) card.content ? card.content.push(newContent) : card.content = [newContent]
            // card.content.push(newContent)
            let tempId = newContent.id
            this.$http.post('/api/content', requestPayload, extraHeaders)
                        .then(response => {
                            // let receivedContent = response.data
                            console.log("API CARD RESPONSE", response)
                            if (isFile) card.content ? card.content.push(response.data.data[0]) : card.content = response.data.data
                            else card.content.find(c => c.id === tempId).id = response.data.data[0].id
                            
                            // this.$nextTick(() => {cards.push(newCard)})
                        })
            
            // console.log("RESULT", requestPayload)
            

        },

        stackCardProgramDeletedContent(programName, deletedContent, cardId) {
            if (this.user === "guest") {
                return
            }
            console.log("DELETE", programName, deletedContent, cardId)
            // console.log(this.cards.find(c => c.info.id === cardId).content.find(c => c.id === deletedContent.id))
            // let contentKey = this.cardProgramNameToKey(programName)
            // console.log(contentKey)
            let c = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId).content
            // let i = c.findIndex(c => c.id === deletedContent.id)

            
            let i = c.findIndex(c => c.id === deletedContent.id)
            c.splice(i, 1)
            
            let requestPayload = {
                cardId: cardId
            }            
            
            console.log("DELETE REQUEST PAYLOAD", requestPayload)
            this.$http.delete('/api/content/' + deletedContent.id, { data: requestPayload })
            .then(response => {
                // let receivedContent = response.data
                console.log("API CARD RESPONSE", response.status)
                // card.content[card.content.length -1].id = response.data[0].id

                // this.$nextTick(() => {cards.push(newCard)})
            })
            

        },

        cardProgramNameToKey(program) {
            switch (program) {            
                case("todo-list") :
                    return "todo";                
                
                case("url-list") :
                    return "url";     
                    
                case("text-editor") :
                    return "text";  
                
                case("youtube-player") :
                    return "embed";  

                case("pdf-viewer") :
                    return "file";  
            }
        },
        
        contentTemplate(type, mainContent, isFile) {
            switch (type) {
                case("image-viewer") : {
                    let path
                    if (isFile) path = ''
                    else path = mainContent
                    let obj = {
                        "id": Math.floor(Math.random() * 1000000000000 ),
                        "isEditing": false,
                        "meta": {},
                        "file": {
                            "path": path,
                        }    
                    }
                    return obj

                }            
                
                case("todo-list") : {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000000000000 ),
                        "meta": {},
                        "todo": {
                            "body": 'New todo',
                            "completed_at": null,
                        },
                        "local": {
                            "isEditing": false,
                        }
                    }
                    return obj
                }
                    
                case("url-list"): {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000000000000 ),
                        "meta": {},
                        "url": {
                            "path": mainContent ?? 'placeholder',
                            "position": 1,
                            "ico": mainContent ? null : 'https://icons.iconarchive.com/icons/treetog/junior/128/earth-icon.png',
                            "name": mainContent ? null : 'Right click to edit',
                        },
                        "local": {
                            "isEditing": false,
                            "url": {
                                "name": mainContent ? null : 'Right click to edit',
                                "ico": 'https://icons.iconarchive.com/icons/treetog/junior/128/earth-icon.png',

                            }
                            
                        }
                    }
                    
                    return obj;
                }  
                    
                case("text-editor") :
                    return "text";  

                case("youtube-player"): {
                    let obj = {
                        "id": Math.floor(Math.random() * 1000000000000 ),
                        "isEditing": false,
                        "meta": {},
                        "embed": {
                            "path": mainContent ?? '',
                        }    
                    }
                    
                    return obj;
                }                
                
                case("pdf-viewer"): { 
                    let path
                    if (isFile) path = ''
                    else path = mainContent
                    let obj = {
                        "id": Math.floor(Math.random() * 1000000000000 ),
                        "isEditing": false,
                        "meta": {},
                        "file": {
                            "path": path,
                        }    
                    }
                    
                    return obj;
                }
            }
        },
        
        stackCardUpdatedItself(cardId, path, value) {
            if (!this.currentBoard) return
            var card = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId)
            if (!card) return
            console.log("UPDATE", path, "TO \"", value, "\" CARD", cardId)
            // console.log(this.currentBoard.stacks[0].cards)
            
            let propertyPath = null

            switch (path) {
                case "info.title":
                    propertyPath = 'local.updatePropertyQueue.title'
                    break;
                case "display.open":
                    propertyPath = 'local.updatePropertyQueue.open'

                    break;                
                case "display.position":
                    propertyPath = 'local.updatePropertyQueue.position'

                    break;                
                case "settings.dimensions.x":
                    propertyPath = 'local.updatePropertyQueue.settings.dimensions.x'

                    break;                
                case "settings.dimensions.y":
                    propertyPath = 'local.updatePropertyQueue.settings.dimensions.y'

                    break;                   
                case "settings.dimensions.width":
                    propertyPath = 'local.updatePropertyQueue.settings.dimensions.width'

                    break;                   
                case "settings.dimensions.height":
                    propertyPath = 'local.updatePropertyQueue.settings.dimensions.height'

                    break;   

                case "local.display.stackPosition":
                    break;

                case "local.delete":
                    this.$http.delete('/api/cards/' + cardId)
                            .then(response => {
                                // let receivedContent = response.data
                                console.log(`API CARD ${card.info.id} DELETE RESPONSE`, response.status)
                                // card.content.find(c => c.id === tempId).id = response.data[0].id
                                // this.$nextTick(() => {cards.push(newCard)})
                            })
                    this.currentBoard.stacks[0].cards.splice(this.currentBoard.stacks[0].cards.findIndex(c => c.info.id === cardId), 1)
                    break;
            
                default:
                    console.log("UNKNOWN PROPERTY ", path)
                    return
            }

            this.setNestedObjectValue(card, path, value)
            if (!propertyPath) return

            this.setNestedObjectValue(card, propertyPath, value)
            // this.setNestedObjectValue(card, path, value)

            if (card.local.updatePropertyTimeout) clearTimeout(card.local.updatePropertyTimeout)
            if (this.user === "guest") {
                return
            }
            card.local.updatePropertyTimeout = setTimeout(() => {
                console.log("TIMEOUT CARD " + card.info.id, card.local.updatePropertyQueue)

                let requestPayload = card.local.updatePropertyQueue
                console.log("REQUEST PAYLOAD", requestPayload)
                this.$http.patch('/api/cards/' + card.info.id, requestPayload)
                            .then(response => {
                                // let receivedContent = response.data
                                console.log(`API CARD ${card.info.id} RESPONSE`, response.status)
                                // card.content.find(c => c.id === tempId).id = response.data[0].id
                                // this.$nextTick(() => {cards.push(newCard)})
                            })
                card.local.updatePropertyQueue = null

            }, 5000);

            // var card = this.currentBoard.stacks[0].cards.find(c => c.info.id === cardId)

            // let requestPayload = {
            //     content: content
            // }
            // console.log("REQUEST PAYLOAD", requestPayload)
            // this.$http.patch('/api/content/' + updatedContent.id, requestPayload)
            //             .then(response => {
            //                 // let receivedContent = response.data
            //                 console.log("API CARD RESPONSE", response.status)
            //                 // card.content.find(c => c.id === tempId).id = response.data[0].id
            //                 // this.$nextTick(() => {cards.push(newCard)})
            //             })
            
            // // console.log(card)
            // this.setNestedObjectValue(card, path, value)
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
        },
        
        onMenuTitleRightClick() {
            if (!this.currentBoard) return
            this.isMenuTitleEditing = true
            this.$nextTick(() => {
                this.$el.querySelector('#menu-title-input').focus()
            })
        },

        onMenuTitleInputKeydownEnter(event) {
            event.target.blur()
            this.isMenuTitleEditing = false
        },
        
        boardUpdateProperty(path, value) {
            this.isMenuTitleEditing = false
            let boardId = this.currentBoardId
            console.log("UPDATE", path, "TO \"", value, "\" BOARD", boardId)

            let propertyPath = null

            switch (path) {
                case "info.title":
                    this.menuTitle = value
                    propertyPath = 'title'
                    break;
                
                default:
                    break;
            }

            this.setNestedObjectValue(this.currentBoard, path, value)

            let requestPayload = {
                [propertyPath]: value
            }

            this.$http.patch('/api/boards/' + boardId, requestPayload)
                            .then(response => {
                                // let receivedContent = response.data
                                console.log(`API BOARD ${boardId} RESPONSE`, response.status)
                                // card.content.find(c => c.id === tempId).id = response.data[0].id
                                // this.$nextTick(() => {cards.push(newCard)})
                            })

        },

        onMenuTitleLeftClick() {
            this.menuTitleTapCount++
            // console.log(this.headerTapCount)
            
            // this.timer ? clearTimeout(this.timer) : this.timer = setTimeout(() => { this.headerTapCount = 0 }, 700);

            setTimeout(() => {
                if (this.menuTitleTapCount >= 2) {
                    this.onMenuTitleRightClick()
                }
                this.menuTitleTapCount = 0

            }, 400);
        },

        boardDivClicked() {

            
            
            if (this.subMenu) {
                this.menuPullClick()
                // this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                // this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                // setTimeout(() => {
                //     this.subMenu = null
                // }, 400);
            }       
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

.debug {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 10000;
    opacity: 0.5;

}

.board {
    position: absolute;
    background-image: linear-gradient(to left bottom, #32bffd, #00aaff, #0092ff, #0076ff, #1653ff);
    height:100%;
    width:100%;
    /* overflow:hidden; */
    overflow: auto;
    z-index: 100;
    padding-top: 60px;
    box-sizing: border-box;
    /* margin-top: 20px; */
}



.cards {
    height:100%;
    width:100%;
    overflow:hidden;
    transition: transform 0.2s;
    /* padding-top: 50px; */
    /* transition: all 0.2s; */
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
    align-items: center;
}

.menu-container {
    /* max-height: 400px; */
    /* height: 400px; */
    /* position: absolute; */
    width: 100%;
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
    /* margin-left: auto; */
    /* margin-right: auto; */
    /* bottom: -19px; */
    background-color: rgba(0, 0, 0, 0.55);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: background-color 0.4s;
    cursor: pointer;
    user-select: none;
    backdrop-filter: blur(5px);
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
    /* display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; */

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    background-color: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
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
    cursor: pointer;
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
    grid-area: 1 / 1 / 2 / 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: space-between; */
    margin-left: 20px;
}

.menu-content-controls-secondary {
    grid-area: 1 / 3 / 2 / 4;
    /* margin-right: 20px; */
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    margin-right: 20px;
    /* justify-content: center; */
}

.menu-content-board-title {
    grid-area: 1 / 2 / 2 / 3;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    opacity: 1;
    white-space: nowrap;
    transition: opacity 1s;
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
    /* user-select: none; */
    margin-top: 0;
    /* height: 0;  */
    padding: 10px;
    /* display: block; */
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.40);
    backdrop-filter: blur(6px);
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

.menu-title-input {
    font-size: 25px;
    font-weight: bold;
    font-style: italic;
    width: 100%;
    margin-left: 10px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.25);
}

.guest {
    position: fixed;
    left: 10px;
    bottom: 10px;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.35);
    padding: 10px;
    border-radius: 10px;
    opacity: 0.8;
}

.guest p {
    color: white;
}

</style>
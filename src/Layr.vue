<template>
    <div id="layr" @click="bodyClicked($event)">
        
        <!-- <div class="debug" v-if="isInDevelopment">
            <div class="token" @click="tokenClicked">

            </div>
        </div> -->
        <credits v-if="showCredits"></credits>
        <ribbon v-if="showRibbon"></ribbon>


        <div class="guest" v-if="user === 'guest'">
            <p><strong> You are viewing this board as a guest.</strong></p>
            <p>Any changes you make will not be saved.</p>
        </div>


        <div class="menu" id="menu">
            <div class="menu-container" id="menu-container">

                <div class="menu-content">

                    <div class="menu-content-controls-primary">
                        <button class="buttons-common button-text-primary" 
                                    @click="menuClick('login')" 
                                    id="menu-login-button"
                                    v-if="user === null"          
                                    :style="{backgroundColor: subMenu === 'login' ? 'lightgreen' : 'white'}"
                                    >
                                    Sign in
                        </button>                        

                        <button class="buttons-common button-text-primary" 
                                    @click="menuClick('register')" 
                                    id="menu-register-button"
                                    v-if="user === null"          
                                    :style="{backgroundColor: subMenu === 'register' ? 'lightgreen' : 'white'}"
                                    >
                                    Sign up
                        </button>                        
                        
                        <button class="buttons-common button-text-primary" 
                                    @click="menuClick('student-dashboard')" 
                                    id="menu-student-dashboard-button"
                                    v-if="userRole === 'student'"          
                                    :style="{backgroundColor: subMenu === 'student-dashboard' ? 'lightgreen' : 'white'}"
                                    >
                                    Dashboard
                        </button>
                        <button class="buttons-common button-text-primary" 
                                    @click="menuClick('students')" 
                                    id="menu-students-button"
                                    v-if="userRole === 'tutor'"          
                                    :style="{backgroundColor: subMenu === 'students' ? 'lightgreen' : 'white'}"
                                    >
                                    Students
                        </button>                        
                        <!-- <button class="buttons-common button-text-primary" 
                                    @click="menuPersonalClick" 
                                    id="menu-personal-button"
                                    v-if="userRole === 'tutor'"          
                                    >
                                    Personal
                        </button> -->
                    </div>
                    

                    <div class="menu-content-board-title" id="menu-title"
                        >
                        <h1
                            @click="onMenuTitleLeftClick"
                            > 
                            {{ menuTitle }}
                        </h1>
                        <!-- <input
                            @blur="stackUpdateProperty('info.title', $event.target.value)"
                            @keydown.enter="onMenuTitleInputKeydownEnter($event)"
                            class="menu-title-input"
                            type="text"
                            id="menu-title-input"
                            v-bind:value="currentStack.info.title"
                            v-if="isMenuTitleEditing"
                            autocomplete="off" 
                        > -->
                    </div>
                    <div class="menu-content-controls-secondary">
                        <button class="menu-content-controls-secondary-settings buttons-common button-text-secondary"
                                    @click="settingsMenu"
                                    >
                                Fullscreen
                        </button>
                        <button id="menu-help-button" class="menu-content-controls-secondary-help buttons-common button-text-secondary" 
                                @click="menuClick('help')"
                                :style="{backgroundColor: subMenu === 'help' ? 'lightgreen' : 'white'}"
                                
                                >
                                Help
                        </button>

                    </div>
                </div>

                <div class="sub-menu-container" id="sub-menu-container">
                    <div class="sub-menu" id="sub-menu" v-show="subMenu !== null">
                        <div class="sub-menu-content">
                            <!-- <component :is="subMenuComponent"></component> -->
                            <keep-alive>
                                <component :is="subMenu ? 'menu-'+subMenu : null" 
                                            v-bind="subMenuContent"
                                            @subMenuStackClicked="requestStack"
                                            @subMenuStackUpdatedItself="stackUpdateProperty"
                                            @loggedIn="userLoggedIn"
                                            @forgotPassword="menuClick('reset-password')"
                                            :user="user"
                                            >
                                            
                                </component>
                            </keep-alive>
                        </div>
                    </div>

                </div>

     

            </div>

            
            <div class="menu-pull" id="menu-pull" v-show="subMenu !== null"
                    @click="menuClick('close')">
                <hr class="menu-pull-line">

            </div>
        </div>
        
        
        <div id="sidebar-right" v-show="stackDataLoaded">
            <div class="sidebar-right-empty-area-right">

            </div> 

            <div class="sidebar-board-list" >
                <div class="sidebar-board" v-for="(board, index) in stackBoards" :key="index" @click="sidebarBoardClicked(board.info.id)">
                    <div class="sidebar-board-index">
                        {{ index + 1 }}
                    </div>
                    <div class="sidebar-board-icon" :style="{'border-color': board.info.id === currentBoardId ? '#02D0FE' : 'white' }">

                    </div>

                </div>

                <div class="sidebar-board-new" @click="createNewBoard" v-if="userRole === 'tutor'">
                    <div class="sidebar-board-new-icon">
                        <img src="@/assets/common/addcirclewhite.svg">
                    </div>
                </div>
            </div>


        </div>


        <div class="board" id="board" @scroll.prevent="onBoardDivWheel" v-if="currentBoard">
            <div id="layout-grid" v-if="currentBoard.settings && currentBoard.settings.layout" :style="gridSettingsStyle">
                <div class="grid-cell" v-for='(cell, i) in currentBoard.settings.layout' :key="i" :style="{gridArea: cell}">
                    
                    <card
                        v-if="cellHasCard(cell)"
                        :key="currentBoard.cards.find(c => c.settings.dimensions === cell).info.id"
                        :card='currentBoard.cards.find(c => c.settings.dimensions === cell)'
                        :hasFocus="cardsHaveFocus"
                        :boardUnload="boardUnload"
                        @cardProgramUpdatedContent="cardProgramUpdatedContent"
                        @cardProgramCreatedContent="cardProgramCreatedContent"
                        @cardProgramDeletedContent="cardProgramDeletedContent"
                        @cardUpdatedItself="cardUpdatedItself"
                    ></card>   

                    <card-selector v-else 
                        @cardSelected="createNewCard"
                        :dimensions='cell'
                        
                        > </card-selector>

                </div>

            </div>

            <div id="layout-selector-container" v-else>
                <layout-selector @templateSelected='boardTemplateSelected'></layout-selector>
            </div>


        </div>
        
        
        <div id="board-controls" v-if="currentBoard">
            <img src="@/assets/common/deletewhite.svg" @click="boardDeleteConfirm = !boardDeleteConfirm">
            <modal-confirm v-if="boardDeleteConfirm" confirmText="Delete"
                    @selectionConfirmed="deleteBoard(currentBoardId)"
                    @selectionCanceled="boardDeleteConfirm = !boardDeleteConfirm"
                    >Are you sure<br>you want to delete this board?</modal-confirm>
            <!-- <modal-confirm>Hello</modal-confirm> -->
        </div>
           
    </div>
</template>

<script>
import Card from './components/Card.vue'
import Credits from './components/Credits.vue'
import Ribbon from './components/Ribbon.vue'
import screenfull from 'screenfull'

import CardSelector from './components/board/CardSelector.vue';
import LayoutSelector from './components/board/LayoutSelector.vue';

import ModalConfirm from './components/modal/Confirm.vue';

export default {
    
    name: 'layr',


    components: {
        Card,
        Credits,
        Ribbon,
        CardSelector,
        LayoutSelector,
        ModalConfirm
    },

    data() {
        return {
            isMenuOpen: true,
            isFullscreen: false,
            subMenu: null,
            currentBoardId: null,
            currentStack: null,
            boardDataLoaded: false,
            boardUnload: false,
            stackDataLoaded: false,
            menuTitle: "Welcome",
            isMenuTitleEditing: false,
            menuTitleTapCount: 0,
            students: null,
            user: null,
            cardsHaveFocus: true,
            boardDeleteConfirm: false,
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
        
        currentBoard() {
            return this.currentStack ? this.currentStack.boards.find(b => b.info.id === this.currentBoardId) : null
        },        
        
        currentStackId() {
            return this.currentStack ? this.currentStack.info.id : null
        },

        cards() {
            return this.currentBoard ? this.currentBoard.cards : null
        },

        // menuTitle() {
        //     return this.currentBoard ? this.currentBoard.info.title : "Loading..."
        // }

        userRole() {
            return this.user ? this.user.role : null
        },

        stackBoards() {
            return this.currentStack ? this.currentStack.boards : null
        },

        isInDevelopment() {
            return process.env.NODE_ENV === "development"
        },

        // cardsCanvas() {
        //     return this.$el.querySelector('#cards').
        // }

        showCredits() {
            return this.user === null
        },

        showRibbon() {
            return true
        },

        gridSettingsStyle() {
            let cells = this.currentBoard.settings.layout
            let maxRow = 0
            let maxCol = 0

            cells.forEach(cell => {
                let split = cell.replaceAll(" ", "").split('/')
                let row = split[2]
                let col = split[3]

                if (row > maxRow) maxRow = row
                if (col > maxCol) maxCol = col
            });

            let w = maxCol - 1
            let h = maxRow - 1

            return {grid: `repeat(${h}, minmax(0, 1fr)) / repeat(${w}, minmax(0, 1fr))`}
        }

    },

    mounted() { 
        
        let path = window.location.pathname
        let parts = path.split('/')
        // console.log(parts)
        switch (parts[1]) {
            case 'invite': 
                if (parts[2] !== undefined) this.menuClick('invite')
                else this.menuClick('login')
                return
            case 'reset-password':
                this.menuClick('reset-password')
                return
        }

        // if (this.isInDevelopment) {
        //     this.$http.get('/api/user').then((response) => {
        //         console.log('Logged in user ', response.data.user)
        //         this.user = response.data.user
        //         this.userLoggedIn(this.user)
        //     }).catch(() => {
        //         // alert('error', error)
        //         // alert(this.$http.baseURL)
        //     })
        //     return
        // }

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
                this.menuClick('login')
            })
        } else {
            switch (parts[1]) {
                case 'signup':
                    this.menuClick('register')
                    return
                default:
                    this.menuClick('login')
                    return
            }
        }

        

    },

    methods: {

        bodyClicked() { // TODO
            // console.log(document.elementsFromPoint(e.clientX, e.clientY))
            // if (this.subMenu && document.elementsFromPoint(e.clientX, e.clientY).filter(el => el.className === "menu" || el.className === "sub-menu").length === 0) this.menuClick('close')
        },


        onBoardDivWheel() {

        },

        sidebarBoardClicked(id) {
            this.openBoard(id)
        },

        createNewBoard() {
            let title = "New board"

            let requestPayload = {
                title: title,
                stackId: this.currentStackId,
                // settings: JSON.stringify(settings),
                // ...(withTag && {tag: withTag})
            }

            // console.log(requestPayload)

            // this.$el.querySelector('#create-stack-button').disabled = true
            this.$http.post('/api/boards', requestPayload)
                        .then(response => {
                            let newBoard = response.data.board
                            if (newBoard.cards === undefined) newBoard.cards = [] 
                            console.log(newBoard)
                            console.log("API BOARD RESPONSE", response.status)
                            this.currentStack.boards.push(newBoard)
                            this.openBoard(newBoard.info.id)
                            
                            this.$nextTick(() => {
                                let el = this.$el.querySelector('.sidebar-board-list')

                                el.scrollTop = el.scrollHeight
                            })
                        })
        },

        boardTemplateSelected(template) {
            console.log("UPDATE TEMPLATE TO \"", template, "\" BOARD", this.currentBoardId)

            this.setNestedObjectValue(this.currentBoard, 'settings.layout', template)


            let requestPayload = {
                settings: {
                    layout: template
                }
            }

            this.$http.patch('/api/boards/' + this.currentBoardId, requestPayload)
                            .then(response => {
                                console.log(`API BOARD ${this.currentBoardId} RESPONSE`, response.status)
                            })


        },

        deleteBoard(id) {
            if (this.boardDeleteConfirm) this.boardDeleteConfirm = false

            let boardIndex = this.currentStack.boards.findIndex(b => b.info.id === id)
            let boards = this.currentStack.boards

            let nextBoard = boards[boardIndex-1]
                            ? boards[boardIndex-1].info.id
                            : boards[boardIndex+1]
                                ? boards[boardIndex+1].info.id
                                : null

            if (nextBoard) this.openBoard(nextBoard)

            this.currentStack.boards.splice(boardIndex, 1)

            this.$http.delete('/api/boards/' + this.currentBoardId)
                .then(response => {
                    console.log(`API BOARD ${this.currentBoardId} RESPONSE`, response.status)
                })
        },

        cellHasCard(cell) {
            return this.currentBoard.cards?.filter(c => c.settings.dimensions === cell).length === 1
        },


        cardsSetFocus(start) {
            
            if (start) {
                this.cardsHaveFocus = false
            } else {
                this.cardsHaveFocus = true
            }
        },


        menuClick(menu) {
            let current = this.subMenu
            if (menu === current || menu === "close") {
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'

                setTimeout(() => {
                    this.subMenu = null
                }, 400);
                
                return
            }
            this.subMenu = menu

            this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'
                
            this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'    
        },

        userLoggedIn(user) {

            this.user = user
            this.menuTitle = "Welcome, " + user.name.split(' ')[0]

            if (this.user.role === 'tutor') this.menuClick('students') 
            else this.menuClick('student-dashboard')

            if (window.location.pathname.split('/')[1] !== "") this.$router.push('/')

            
        },

        setLayrTitle(title) {
            this.menuTitle = title
        },

        settingsMenu() {
            screenfull.toggle(); 
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
                            "dimensions": card.settings.dimensions,
                            // "program": "gallery",

                        
                        },

                        "content": [

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
                            "dimensions": card.settings.dimensions,

                            // "program": "list",
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
                            "dimensions": card.settings.dimensions,
 
                            // "program": "list",
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
                            "title": "Notes"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/text.svg'),
                        },
                        "settings": {
                            "dimensions": card.settings.dimensions,
 
                            // "program": "texteditor",
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
                                "meta": {},
                                "text": {
                                    "text": ""
                                }
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
                            "dimensions": card.settings.dimensions,

                            // "program": "pdfviewer",
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
                            "dimensions": card.settings.dimensions,

                            // "program": "youtubeplayer",
                        },

                        "content" : [],

                    }

                case("whiteboard"):
                    return {
                        "info": {
                            "title": "Whiteboard"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/whiteboard.svg'),
                        },
                        "settings": {
                            "dimensions": card.settings.dimensions,
 
                            // "program": "whiteboard",
                        },

                        "content": [
                            {
                                "id": Math.floor(Math.random()*10000),
                                "meta": {},
                                "whiteboard": {
                                    "data": {"background": "#FFFFFF"}
                                }
                            }
                        ],

                    }
            }
        },

        requestStack(id) {
            if (!this.userRole) this.user = "guest"

            this.menuClick('close')
            if (this.currentStack) this.currentStack = null

            this.menuTitle = "Loading..."

            this.$http.get('/api/stacks/' + id)
                .then(response => {
                    console.log("API GET RESPONSE FOR STACK ID ", id)
                    console.log(response.data)
                    let r = response.data.stack
                    this.openStack(r)
                } )           
        },

        processCards(cards) {
            cards.forEach(card => {
                switch (card.info.type) {
                    case 'todo':
                        this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/todo.svg'))
                        
                        card.content.forEach(content => {
                            // this.setNestedObjectValue(content, 'local.isEditing', false)
                            this.$set(content, 'local', {})
                            this.$set(content.local, 'isEditing', false)
                            
                        })
                        
                        break;
                    case 'url':
                        this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/link.svg'))

                        card.content.forEach(content => {
                            // this.setNestedObjectValue(content, 'local.isEditing', false)
                            this.$set(content, 'local', {})
                            this.$set(content.local, 'isEditing', false)                            
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
                        
                    case 'whiteboard':
                        this.setNestedObjectValue(card, 'local.display.icon', require('@/assets/cards/icons/whiteboard.svg'))

                        break;
                    
                    default:
                        break;
                }

            })
        },
        
        openStack(stack) {
            this.stackDataLoaded = false
            this.currentStack = stack
            this.$nextTick(() => {
                if (stack.boards?.length > 0) this.openBoard(stack.boards[0].info.id)
                this.stackDataLoaded = true
                this.menuTitle = stack.info.title
            })

        },

        openBoard(id) {
            if (this.boardDeleteConfirm) this.boardDeleteConfirm = false
            this.boardUnload = true
            this.$nextTick(() => {
                this.currentBoardId = id
                this.processCards(this.currentBoard.cards)
                this.boardUnload = false
            })
        },

        createNewCard(cardType, dimensions) {
            if (this.user === "guest") {
                return
            }

            let newCardDefaults = this.cardTemplate(
                {
                    "info": {
                        "type": cardType
                    },
                    "settings": {
                        // "program": card.program,
                        "dimensions": dimensions
                    },
                }
            )            

            let requestPayload = {
                type: cardType,
                boardId: this.currentBoard.info.id,
                title: newCardDefaults.info.title,
                settings: JSON.stringify(newCardDefaults.settings),
                content: newCardDefaults.content,
            }      
            
            let cards = this.currentBoard.cards

            return this.$http.post('/api/cards', requestPayload)
                        .then(response => {
                            let newCard = response.data.card
                            if (!newCard.content) newCard.content = []
                            console.log("API CARD RESPONSE", response.status)
                            this.processCards([newCard])
                            this.$nextTick(() => {cards.push(newCard)})
                        })
        },

        cardProgramUpdatedContent(programName, updatedContent, cardId) {
            console.log("UPDATE", programName, updatedContent, "CARD", cardId)
            let c = this.currentBoard.cards.find(c => c.info.id === cardId).content.find(c => c.id === updatedContent.id)
            
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
                            console.log("API CARD RESPONSE", response.status)
                        })

            c[contentKey] = updatedContent[contentKey]

        },

        cardProgramCreatedContent(programName, mainContent, cardId) {
            if (this.user === "guest") {
                return
            }
            console.log("CREATE", "FROM", programName, "MAIN CONTENT", mainContent ?? null, "CARD", cardId)
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
            console.log("REQUEST PAYLOAD", requestPayload)
            let card = this.currentBoard.cards.find(c => c.info.id === cardId)
            if (!isFile) card.content ? card.content.push(newContent) : card.content = [newContent]
            let tempId = newContent.id
            this.$http.post('/api/content', requestPayload, extraHeaders)
                        .then(response => {
                            // let receivedContent = response.data
                            console.log("API CARD RESPONSE", response)
                            if (isFile) card.content ? card.content.push(response.data.data[0]) : card.content = response.data.data
                            else card.content.find(c => c.id === tempId).id = response.data.data[0].id
                        })
        },

        cardProgramDeletedContent(programName, deletedContent, cardId) {
            if (this.user === "guest") {
                return
            }
            console.log("DELETE", programName, deletedContent, cardId)
            let c = this.currentBoard.cards.find(c => c.info.id === cardId).content
            let i = c.findIndex(c => c.id === deletedContent.id)
            c.splice(i, 1)
            
            let requestPayload = {
                cardId: cardId
            }            
            
            console.log("DELETE REQUEST PAYLOAD", requestPayload)
            this.$http.delete('/api/content/' + deletedContent.id, { data: requestPayload })
            .then(response => {
                console.log("API CARD RESPONSE", response.status)
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
                    
                case("whiteboard") :
                    return "whiteboard";  
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

                case("whiteboard") :
                    return "whiteboard"; 
            }
        },
        
        cardUpdatedItself(cardId, path, value) {
            if (!this.currentBoard) return
            let card = this.currentBoard.cards.find(c => c.info.id === cardId)
            if (!card) return
            console.log("UPDATE", path, "TO \"", value, "\" CARD", cardId)
            
            let propertyPath = null

            switch (path) {
                case "info.title":
                    propertyPath = 'local.updatePropertyQueue.title'
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

                case "local.delete":
                    this.$http.delete('/api/cards/' + cardId)
                            .then(response => {
                                console.log(`API CARD ${card.info.id} DELETE RESPONSE`, response.status)
                            })
                    this.currentBoard.cards.splice(this.currentBoard.cards.findIndex(c => c.info.id === cardId), 1)
                    break;
            
                default:
                    console.log("UNKNOWN PROPERTY ", path)
                    return
            }

            this.setNestedObjectValue(card, path, value)
            if (!propertyPath) return

            this.setNestedObjectValue(card, propertyPath, value)

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
        },


        // onMenuTitleRightClick() {
        //     if (!this.currentStack) return
        //     this.isMenuTitleEditing = true
        //     this.$nextTick(() => {
        //         this.$el.querySelector('#menu-title-input').focus()
        //     })
        // },

        onMenuTitleInputKeydownEnter(event) {
            event.target.blur()
            this.isMenuTitleEditing = false
        },
        
        stackUpdateProperty(stackId, path, value) {
            this.isMenuTitleEditing = false
            console.log("UPDATE", path, "TO \"", value, "\" STACK", stackId)

            let propertyPath = null

            switch (path) {
                case "info.title":
                    if (this.currentStack && this.currentStack.info.id === stackId) this.menuTitle = value
                    propertyPath = 'title'
                    // this.$set(this.currentStack.info.title, )
                    break;
                
                default:
                    break;
            }

            if (this.currentStack) this.setNestedObjectValue(this.currentStack, path, value)


            let requestPayload = {
                [propertyPath]: value
            }

            this.$http.patch('/api/stacks/' + stackId, requestPayload)
                            .then(response => {
                                console.log(`API STACK ${stackId} RESPONSE`, response.status)
                            })

        },

        onMenuTitleLeftClick() {
            this.menuTitleTapCount++

            setTimeout(() => {
                if (this.menuTitleTapCount >= 2) {
                    this.onMenuTitleRightClick()
                }
                this.menuTitleTapCount = 0
            }, 400);
        },

    },


}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500&display=swap');

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

body {
    /* overflow: hidden; */
}

.debug {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 10000;
    opacity: 0.5;

}

.buttons-common {
    text-decoration: none;
    user-select: none;
    color:black;
    background-color: white;
    border-radius: 99px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    transition: background-color 0.4s,
                box-shadow 0.1s;
    cursor: pointer;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 14px;

}

.buttons-common:hover:not([disabled]) {
    box-shadow: 0 0 0pt 2pt lightgreen;

}

.buttons-common-red {
    background-color: rgb(255, 91, 91);
}

.buttons-common-red:hover:not([disabled]) {
    box-shadow: 0 0 0pt 2pt rgb(248, 26, 26);

}

.button-next {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 35px; */
    /* width: 35px; */
}

.button-next p {
    margin-right: 4px;
}

.button-next img {
    height: 23px;
    width: 23px;
}

.input-common {
    width: 250px;
    max-height: 35px;
    box-sizing: border-box;
    /* flex: 1; */
    background-color: lightgray;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 1px 1px 3px 0 rgba(255, 255, 255, 0.1);
    transition: padding 0.15s, box-shadow 0.15s;
    margin-bottom: 10px;
}

.input-common:hover:not([disabled]) {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
            1px 1px 3px 0 rgba(255, 255, 255, 0.1),
            0 0 0 2px lightskyblue;
}

.input-common:focus {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
            1px 1px 3px 0 rgba(255, 255, 255, 0.1),
            0 0 0 2px lightskyblue;
}

.input-common-error {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
        1px 1px 3px 0 rgba(255, 255, 255, 0.1),
        0 0 0 3px lightcoral;
}

.containers-common {
    background-color: rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    /* justify-content: center; */
}

.container-center {
    align-items: center;

}

.container-flex-column {
    display: flex;
    flex-direction: column;
}

.container-flex-row {
    display: flex;
    flex-direction: row;
}

.container-white {
    background-color: white;

}

.container-title {
    font-size: 20px;
    font-weight: bold;
}

.container-header {
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: white;
    /* width: 100%; */
    color: black;
    font-weight: bold;
    padding-left: 20px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    user-select: none;
    /* height: 40px; */
    /* display: flex; */
    /* flex-direction: row; */
    /* align-items: center; */
    /* justify-content: center; */
    /* margin-bottom: 5px; */
}

.container-header-center{
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
}


.container-text {
    font-size: 14px;
    color: white;
    padding: 10px;
}

.container-text-white {
    color: white;
}

.container-text-black {
    color: black;
}

.container-padding {
    padding-bottom: 10px;
}

.item-title {
    overflow: hidden;
    color: white;
    font-size: 16px;
    /* font-weight: bold; */
    margin-top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgba(0, 0, 0, 0.25);
    border: 3px solid white;
    user-select: none;
    /* cursor: pointer; */
}

.link-mail {
    /* color: white; */
    text-decoration: underline;
    /* font-weight: bold; */
    color: lightgreen;
}

.link-common {
    color: black;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s;
    font-size: 13px;
    user-select: none;
}

.link-common:hover {
    color: lightgreen;
}

.horizontal-line {
    border-top: 1px solid black;
    margin-top: 5px;
    width: 100%;
}

.form-message {
    font-size: 14px;
    color: black;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.form-message-padding {
    padding-top: 5px;
    padding-bottom: 5px;
}

.misc-icon {
    height: 25px;
    margin-right: 5px;
}




#layr {
    display: grid;
    width: 100%;
    height: 100vh;
    grid-template-columns: 30px minmax(0, 1fr) 30px;
    grid-template-rows: 70px minmax(0, 1fr) 30px;
    overflow: hidden;
    background: linear-gradient(90deg, rgba(52,52,205,1) 0%, rgba(0,212,255,1) 100%);
}

#board {
    /* position: absolute; */
    position: relative;
    /* background-image: linear-gradient(to left bottom, #32bffd, #00aaff, #0092ff, #0076ff, #1653ff); */
    /* overflow: auto; */
    z-index: 100;
    /* margin-top: 20px; */
    grid-area: 2 / 2 / 3 / 3;
    display: grid;
    grid-template-columns: 5px minmax(0, 1fr) 5px;
    grid-template-rows: 5px minmax(0, 1fr) 5px;
}

#board-controls {
    position: fixed;
    z-index: 10000;
    right: 0;
    top: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: rgba(0,0,0,.35);
    border-radius: 0 0 0 5px;
}

#board-controls img {
    height: 20px;
    cursor: pointer;
}

#layout-grid {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 200;
    display: grid;
    overflow: hidden;
    grid-area: 2 / 2 / 3 / 3;
    gap: 10px;
    box-shadow: 0px 0px 0px 2px rgba(235, 235, 235, 0.2);
}

#layout-selector-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    grid-area: 2 / 2 / 3 / 3;
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
    /* position: fixed; */
    /* margin-left: 10px;
    margin-right: 10px; */
    /* overflow:hidden; */
    grid-area: 1 / 2 / 2 / 3;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    /* left: 0px; */
    /* right: 0px; */
    /* top: 0px; */
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
    /* overflow: hidden; */
    transition: top 0.4s,
                max-height 0.4s
                ;
}

.menu-pull {
    width: 70px;
    min-height: 19px;
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


.button-text-primary {
    margin-right: 15px;
}

.button-text-secondary {
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
    font-size: 22px;
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
    overflow: hidden;

    /* padding-top: 5px; */
}

.sub-menu-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.menu-title-input {
    font-size: 22px;
    font-weight: bold;
    font-style: italic;
    width: 100%;
    margin-left: 10px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.25);
}

#sidebar-right {
    width: 90%;
    margin-left: 5px;
    max-height: 100%;
    align-self: center;
    grid-area: 2 / 3 / 3 / 4;
    background-color: rgba(0, 0, 0, 0.3);
    /* transition: width 0.3s, translate 0.3s; */
    transition: all 0.3s;
    border-radius: 10px 0 0 10px;
    /* height: 90%; */
    position: relative;
    display: grid;
    grid-template-columns: 5px minmax(0, 1fr) 10px;
    grid-template-rows: 20px minmax(0, 1fr) 20px;
    z-index: 300;
    backdrop-filter: blur(6px);

    /* overflow: hidden; */
    /* overflow-y: scroll; */

}

#sidebar-right:hover {
/* #sidebar-right { */
    grid-template-columns: 10px minmax(0, 1fr) 10px;
    width: 150px;
    transform: translateX(-135px);
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.75);
    /* filter: blur(3px); */


}

#sidebar-right:hover .sidebar-board-list {
    grid-area: 2 / 2 / 3 / 3;

}

#sidebar-right:hover .sidebar-board-icon {
    box-shadow: inset 0 0 5px 0 black;
    
}



.sidebar-right-empty-area-left {
    position: absolute;
    top: 0;
    right:30px;
    height: 100%;
    width: 30px;
    z-index: 10;
    /* background-color: red; */
    /* visibility: hidden; */
}

.sidebar-right-empty-area-right {
    position: absolute;
    top: 0;
    right:-30px;
    height: 100%;
    width: 30px;
    z-index: 10;
    /* background-color: yellow; */
    /* visibility: hidden; */
}

.sidebar-board-list {
    /* width: 90%; */
    height: 100%;
    grid-area: 2 / 2 / 3 / 4;
    z-index: 20;
    /* overflow: auto; */
    overflow-y: scroll;
    scroll-behavior: smooth;

    /* overflow-x: auto; */
}

.sidebar-board-list::-webkit-scrollbar {
    width: 0px;
}

.sidebar-board {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    align-items: center;
    cursor: pointer;
    /* min-width: 30px; */
}

.sidebar-board-icon {
    /* max-width: 50px; */
    height: 100%;
    background-color: white;
    border-radius: 8px;
    flex: 7;
    border: 5px solid white;
    box-sizing: border-box;
    transition: border 0.1s, box-shadow 0.2s;
}

.sidebar-board-index {
    color: white;
    flex: 1;
    /* margin-right: 3px; */
    user-select: none;
    min-width: 10px;
    text-align: center;
}

.sidebar-board-new {
    /* width: 100%; */
    /* height: 70px; */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    max-width: 0;
    overflow: hidden;
    transition: all 0.2s;
}

#sidebar-right:hover .sidebar-board-new {
    max-width: initial;

}


.sidebar-board-new-icon {
    /* height: 100%; */
    background-color:rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    /* flex: 2; */
    box-shadow: inset 0 0 5px 0 black;
    border: 4px solid lightgreen;
    box-sizing: border-box;
    transition: border 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    width: 100%;
    overflow: hidden;
}

.sidebar-board-new-icon img {
    height: 25px;
    user-select: none;
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
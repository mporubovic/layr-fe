<template>
    <div id="layr">
        
        <!-- <div class="debug" v-if="isInDevelopment">
            <div class="token" @click="tokenClicked">

            </div>
        </div> -->
        <div class="guest" v-if="user === 'guest'">
            <p><strong> You are viewing this board as a guest.</strong></p>
            <p>Any changes you make will not be saved.</p>
        </div>


        <div class="menu" id="menu">
            <div class="menu-container" id="menu-container">

                <div class="menu-content">

                    <div class="menu-content-controls-primary">
                        <button class="buttons-common button-text-primary" 
                                    @click="menuLoginClick" 
                                    id="menu-login-button"
                                    v-if="user === null"          
                                    :style="{backgroundColor: subMenu === 'menu-login' ? 'lightgreen' : 'white'}"
                                    >
                                    Sign in
                        </button>                        
                        
                        <button class="buttons-common button-text-primary" 
                                    @click="menuStudentDashboardClick" 
                                    id="menu-student-dashboard-button"
                                    v-if="userRole === 'student'"          
                                    :style="{backgroundColor: subMenu === 'menu-student-dashboard' ? 'lightgreen' : 'white'}"
                                    >
                                    Dashboard
                        </button>
                        <button class="buttons-common button-text-primary" 
                                    @click="menuStudentsClick" 
                                    id="menu-students-button"
                                    v-if="userRole === 'tutor'"          
                                    :style="{backgroundColor: subMenu === 'menu-students' ? 'lightgreen' : 'white'}"
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
                                @click="menuHelpClick"
                                :style="{backgroundColor: subMenu === 'menu-help' ? 'lightgreen' : 'white'}"
                                
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
                                <component :is="subMenu" 
                                            v-bind="subMenuContent"
                                            @subMenuStackClicked="requestStack"
                                            @subMenuStackUpdatedItself="stackUpdateProperty"
                                            @loggedIn="userLoggedIn"
                                            :user="user"
                                            >
                                            
                                </component>
                            </keep-alive>
                        </div>
                    </div>

                </div>

     

            </div>

            
            <!-- <div class="menu-pull" id="menu-pull"
                    @click="menuPullClick">
                <hr class="menu-pull-line">

            </div> -->
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

        <div id="sidebar-bottom" v-show="stackDataLoaded">
            <div id="card-carousel">
                <div class="card-button" v-for="(card, index) in newCards" :key="index">
                    <div class="card-button-draggable" :data-type="card.type">
                        <img :src="card.icon" draggable="false">
                        <p>{{ card.title }}</p>
                    </div>

                </div>
            </div>

            <div id="card-carousel-ghost">
                <div class="card-button-ghost" v-for="(card, index) in newCards" :key="index">
                    <img :src="card.icon" draggable="false">
                    <p>{{ card.title }}</p>

                </div>                        
            </div>
        </div>


        <div class="board" id="board" @click="boardDivClicked" @scroll.prevent="onBoardDivWheel">
            

            <div id="layout-grid">

                <card v-for="(card, index) in cards" 
                    :key="card.info.id"
                    :card=card
                    :index=index
                    :hasFocus="cardsHaveFocus"
                    :boardUnload="boardUnload"
                    :dropzoneGrid='dropzoneGrid'
                    @cardInteractJsDrag="cardsSetFocus"
                    @cardInteractJsResize="cardsSetFocus"
                    @cardProgramUpdatedContent="cardProgramUpdatedContent"
                    @cardProgramCreatedContent="cardProgramCreatedContent"
                    @cardProgramDeletedContent="cardProgramDeletedContent"
                    @cardUpdatedItself="cardUpdatedItself"
                    @cardDragStart="cardDragStart"
                    @cardResizeStart="cardResizeStart"
                    @cardDragEnd="cardDragEnd"
                    @cardResizeEnd="cardResizeEnd"

                ></card>   


                </div>

            
            <div id="dropzone-grid">


                <div v-for="(cell, index) in dropzoneGrid.cells" 
                        :key="index"
                        class="dropzone" 
                        :ref="'dropzone-cell'"
                        :id="'cell-'+index"
                        :column='cell.column'
                        :row='cell.row'
                        >
                        
                        <div class="dropzone-placeholder"></div>
                </div>
            </div>

        </div>
           
    </div>
</template>

<script>
import Card from './components/Card.vue'
import screenfull from 'screenfull'
import interact from "interactjs";

export default {
    
    name: 'layr',


    components: {
        Card
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
            userDomain: null,
            userSubdomain: null,
            students: null,
            user: null,
            // cards: [],
            dropzoneGrid: {
                cells: [],
                cellHeight: 0,
                cellWidth:0,
                DOMcells: []
            },

            tempCard: {},

            cardsHaveFocus: true,
            newCards: [              
                {
                    "type": "whiteboard",
                    "program": "whiteboard",
                    "available": true,
                    "title": "Draw",
                    "icon": require('@/assets/cards/icons/whiteboard.svg'),
                    "description": "Create a whiteboard",
                    "width": 2,
                    "height": 2,
                },                 
                {
                    "type": "pdf",
                    "program": "pdfviewer",
                    "available": true,
                    "title": "PDF",
                    "icon": require('@/assets/cards/icons/pdf.svg'),
                    "description": "Upload a PDF from your device",
                    "width": 1,
                    "height": 2,
                },      
                {
                    "type": "youtube",
                    "program": "youtubeplayer",
                    "available": true,
                    "title": "Video",
                    "icon": require('@/assets/cards/icons/youtube.svg'),
                    "description": "Play a video from YouTube",
                    "width": 2,
                    "height": 2,
                },                
                {
                    "type": "text",
                    "program": "texteditor",
                    "available": true,
                    "title": "Notes",
                    "icon": require('@/assets/cards/icons/text.svg'),
                    "description": "Create a note with a text editor",
                    "width": 1,
                    "height": 2,
                },                
                {
                    "type": "url",
                    "program": "list",
                    "title": "URL",
                    "available": true,
                    "icon": require('@/assets/cards/icons/link.svg'),
                    "description": "Create a list of URLs",
                    "width": 1,
                    "height": 1,
                },                
                {
                    "type": "image",
                    "program": "gallery",
                    "available": true,
                    "title": "Image",
                    "icon": require('@/assets/cards/icons/image.svg'),
                    "description": "Upload images from your device",
                    "width": 1,
                    "height": 1,
                },                  
                {
                    "type": "todo",
                    "program": "list",
                    "available": true,
                    "title": "Todo",
                    "icon": require('@/assets/cards/icons/todo.svg'),
                    "description": "Create a todo list",
                    "width": 1,
                    "height": 1,
                },  


            ],
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
        }

        // cardsCanvas() {
        //     return this.$el.querySelector('#cards').
        // }

    },

    created() {
        window.addEventListener("resize", this.windowResized);
    },

    destroyed() {
        window.removeEventListener("resize", this.windowResized);
    },
    
    mounted() { 
        
        let path = window.location.pathname
        let parts = path.split('/')
        // console.log(parts)
        if (parts[1] === 'invite' && parts[2] !== undefined) {
            this.inviteDropdown()
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
                this.loginDropdown()
                
            })
        } else {
            this.loginDropdown()
        }

        

    },

    methods: {
        onBoardDivWheel() {

        },

        dropzoneGridSetup() {
            this.dropzoneGrid.cells = []
            this.dropzoneGrid.DOMcells = []
            
            let w = this.currentBoard.settings.dimensions.width
            let h = this.currentBoard.settings.dimensions.height
            let gap = 10

            let dropzoneGrid = this.$el.querySelector('#dropzone-grid').style

            dropzoneGrid.grid = `repeat(${h}, minmax(0, 1fr)) / repeat(${w}, minmax(0, 1fr))`
            let layoutGrid = this.$el.querySelector('#layout-grid').style

            layoutGrid.grid = `repeat(${h}, minmax(0, 1fr)) / repeat(${w}, minmax(0, 1fr))`
            layoutGrid.gap = gap + 'px'

            let gridArea = w * h
            
            for (let index = 0; index < gridArea; index++) {
                let column = index - Math.floor(index/(w))*w
                let row = Math.floor(index/(w))

                let cell = {
                    column,
                    row
                }
                this.dropzoneGrid.cells.push(cell)
            }

        },

        windowResized() {
            if (!this.currentBoard) return
            let r = this.$el.querySelector('#cell-0').getBoundingClientRect()
            this.dropzoneGrid.cellHeight = r.height
            this.dropzoneGrid.cellWidth = r.width
            this.dropzoneGrid.rect = this.$el.querySelector('#dropzone-grid').getBoundingClientRect()
        },

        cardDragStart(id, left, top) {
            this.cardsHaveFocus = false
            
            
            let card = this.currentBoard.cards.find(c => c.info.id === id)
            let tempX = Math.floor((left - this.dropzoneGrid.rect.left + 0.5*this.dropzoneGrid.cellWidth) / this.dropzoneGrid.cellWidth)
            let tempY = Math.floor(((top - this.dropzoneGrid.rect.top + 0.5*this.dropzoneGrid.cellHeight) / this.dropzoneGrid.cellHeight))

            card.local.newColumn = tempX 
            card.local.newRow = tempY

            let w = card.settings.dimensions.width
            let h = card.settings.dimensions.height

            let overlap = this.checkOverlap(id, tempX, tempY, tempX + w - 1, tempY + h - 1)
            card.local.overlap = overlap
            // console.log(tempX, tempY, tempX + w - 1, tempY + h - 1, overlap)
            this.deactivateAllDropzones()
            this.activateDropzonesInArea(tempX, tempY, tempX + w - 1, tempY + h - 1, overlap)
        },

        cardDragEnd(id) { 
            this.cardsHaveFocus = true
            
            let card = this.currentBoard.cards.find(c => c.info.id === id)

            let anchorCell = this.dropzoneGrid.DOMcells.find(drop => parseInt(drop.getAttribute('column')) === card.settings.dimensions.x &&
                                                            parseInt(drop.getAttribute('row')) === card.settings.dimensions.y
            
            )

            let newCell = this.dropzoneGrid.DOMcells.find(drop => parseInt(drop.getAttribute('column')) === card.local.newColumn &&
                                                            parseInt(drop.getAttribute('row')) === card.local.newRow
            
            )

            if (!card.local.overlap) {
                let dx = (parseInt(newCell.getAttribute('column')) - parseInt(anchorCell.getAttribute('column')))  * this.dropzoneGrid.cellWidth
                let dy = (parseInt(newCell.getAttribute('row')) - parseInt(anchorCell.getAttribute('row'))) * this.dropzoneGrid.cellHeight
                card.local.dx = dx
                card.local.dy = dy



                setTimeout(() => {
                    this.cardUpdatedItself(id, 'settings.dimensions.x', card.local.newColumn)
                    this.cardUpdatedItself(id, 'settings.dimensions.y', card.local.newRow)
                }, 200);
            }

            setTimeout(() => {
                this.deactivateAllDropzones()
                
            }, 200);
            
        },

        cardResizeStart(id, x, y) {
            this.cardsHaveFocus = false

            let els = document.elementsFromPoint(x, y)
            let card = this.currentBoard.cards.find(c => c.info.id === id)
                            
            let newCell = els.find(el => el.classList.contains("dropzone"))
            let newCellRow = parseInt(newCell.getAttribute('row'))
            let newCellColumn = parseInt(newCell.getAttribute('column'))

            let newCellRect = newCell.getBoundingClientRect()

            let offsetX = (x - newCellRect.left) > (this.dropzoneGrid.cellWidth *0.5) ? 0 : -1
            let offsetY = (y - newCellRect.top) > (this.dropzoneGrid.cellHeight *0.5) ? 0 : -1

            let anchorCellRow = card.settings.dimensions.y
            let anchorCellColumn = card.settings.dimensions.x
            
            if (newCellColumn+offsetX < anchorCellColumn) offsetX = 0
            if (newCellRow+offsetY < anchorCellRow) offsetY = 0
            
            card.local.newColumn = newCellColumn + offsetX
            card.local.newRow = newCellRow + offsetY
            
            let overlap = this.checkOverlap(id, anchorCellColumn, anchorCellRow, newCellColumn+offsetX, newCellRow+offsetY)
            card.local.overlap = overlap
            
            this.deactivateAllDropzones()
            this.activateDropzonesInArea(anchorCellColumn, anchorCellRow, newCellColumn+offsetX, newCellRow+offsetY, overlap)
                        
        },

        cardResizeEnd(id) {
            this.cardsHaveFocus = true

            let card = this.currentBoard.cards.find(c => c.info.id === id)
            
            if (!card.local.overlap) {
                let width = card.local.newColumn + 1 - card.settings.dimensions.x
                let height = card.local.newRow + 1 - card.settings.dimensions.y
                this.cardUpdatedItself(id, 'settings.dimensions.width', width)
                this.cardUpdatedItself(id, 'settings.dimensions.height', height)
            }
            this.deactivateAllDropzones()

        
        },


        getOuterDropzones(dropzones) {
            let topleftDrop = dropzones[0]
            let bottomrightDrop = dropzones[dropzones.length-1]

            let firstColumn = parseInt(topleftDrop.getAttribute('column'))
            let lastColumn = parseInt(bottomrightDrop.getAttribute('column'))
            let firstRow = parseInt(topleftDrop.getAttribute('row'))
            let lastRow = parseInt(bottomrightDrop.getAttribute('row'))


            let toprightDrop = firstRow !== lastRow ? dropzones.find(drop => parseInt(drop.getAttribute('row')) === firstRow && 
                                                        parseInt(drop.getAttribute('column')) === lastColumn)

                                                    : bottomrightDrop
            
            let bottomleftDrop = firstColumn !== lastColumn ? dropzones.find(drop => parseInt(drop.getAttribute('row')) === lastRow && 
                                                                parseInt(drop.getAttribute('column')) === firstColumn)
                                                            : bottomrightDrop

            let leftBetween = dropzones.filter(drop => parseInt(drop.getAttribute('row')) > firstRow && 
                                                        parseInt(drop.getAttribute('row')) < lastRow && 
                                                        parseInt(drop.getAttribute('column')) === firstColumn)
            
            let topBetween = dropzones.filter(drop => parseInt(drop.getAttribute('column')) > firstColumn && 
                                                        parseInt(drop.getAttribute('column')) < lastColumn &&
                                                        parseInt(drop.getAttribute('row')) === firstRow
                                                        
                                                        )
            
            let rightBetween = dropzones.filter(drop => parseInt(drop.getAttribute('row')) > firstRow && 
                                                        parseInt(drop.getAttribute('row')) < lastRow && 
                                                        parseInt(drop.getAttribute('column')) === lastColumn)
            
            let bottomBetween = dropzones.filter(drop => parseInt(drop.getAttribute('column')) > firstColumn && 
                                                        parseInt(drop.getAttribute('column')) < lastColumn && 
                                                        parseInt(drop.getAttribute('row')) === lastRow)
            
            return {
                corners: [topleftDrop, toprightDrop, bottomrightDrop, bottomleftDrop],
                middle: {
                    
                    left: leftBetween,
                    top: topBetween,
                    right: rightBetween,
                    bottom: bottomBetween
                }

            }
        },
        
        activateDropzonesInArea(x1, y1, x2, y2, restrict) {
            let cells = this.dropzoneGrid.DOMcells
            if (x1 < 0) x1 = 0
            if (x2 < 0) x2 = 0
            if (y1 < 0) y1 = 0
            if (y2 < 0) y2 = 0

            // console.log(x1, y1, x2, y2)
            let dropzones = cells.filter(drop => drop.getAttribute('column') >= x1 &&
                                                    drop.getAttribute('column') <= x2 &&
                                                    drop.getAttribute('row') >= y1 &&
                                                    drop.getAttribute('row') <= y2
            )

            dropzones.forEach(drop => {
                drop.children[0].style['background-color'] = restrict ? 'rgba(247, 82, 82, 0.4)' : 'rgba(78, 255, 55, 0.2)'
                drop.children[0].style['border-color'] = restrict ? 'rgba(255, 0, 0, 0.8)' : 'rgba(57, 255, 31, 0.8)'
            })

            let outerDropzones = this.getOuterDropzones(dropzones)

            let cornerDropzones = outerDropzones.corners

            cornerDropzones[0].children[0].style['border-top-left-radius'] = '10px'
            cornerDropzones[1].children[0].style['border-top-right-radius'] = '10px'
            cornerDropzones[2].children[0].style['border-bottom-right-radius'] = '10px'
            cornerDropzones[3].children[0].style['border-bottom-left-radius'] = '10px'            
            
            let middleDropzones = outerDropzones.middle

            for (const [side, drops] of Object.entries(middleDropzones)) {
                if (drops) drops.forEach(drop => {
                    drop.children[0].style[`border-${side}-width`] = '5px'
                    drop.style[`padding-${side}`] = restrict ? '0' : '5px' 
                })
            }

            if (!restrict) {
                cornerDropzones[0].style['padding-left'] = '5px'
                cornerDropzones[0].style['padding-top'] = '5px'
                cornerDropzones[1].style['padding-right'] = '5px'
                cornerDropzones[1].style['padding-top'] = '5px'
                cornerDropzones[2].style['padding-right'] = '5px'
                cornerDropzones[2].style['padding-bottom'] = '5px'
                cornerDropzones[3].style['padding-left'] = '5px'
                cornerDropzones[3].style['padding-bottom'] = '5px'
            }

            cornerDropzones[0].children[0].style['border-left-width'] = '5px'
            cornerDropzones[0].children[0].style['border-top-width'] = '5px'
            cornerDropzones[1].children[0].style['border-right-width'] = '5px'
            cornerDropzones[1].children[0].style['border-top-width'] = '5px'
            cornerDropzones[2].children[0].style['border-right-width'] = '5px'
            cornerDropzones[2].children[0].style['border-bottom-width'] = '5px'
            cornerDropzones[3].children[0].style['border-left-width'] = '5px'
            cornerDropzones[3].children[0].style['border-bottom-width'] = '5px'
            



        },
        
        deactivateAllDropzones() {
            this.dropzoneGrid.DOMcells.forEach(drop => {
                // drop.children[0].style['background-color'] = 'white'
                drop.children[0].style['background-color'] = null
                drop.children[0].style['border-radius'] = null
                drop.children[0].style['border'] = null
                drop.style['padding'] = null

            })
        },

        checkOverlap(id, minx2, miny2, maxx2, maxy2) {
            let result = false
            let grid = this.dropzoneGrid


            if (maxy2 >= grid.height || miny2 < 0 || minx2 < 0 || maxx2 >= grid.width) {
                if (minx2 === maxx2 && miny2 === maxy2) return false
                else return true
            }

            this.currentBoard.cards.filter(crd => crd.info.id !== id).forEach(c => {
                let minx1 = c.settings.dimensions.x
                let miny1 = c.settings.dimensions.y
                let maxx1 = minx1 + c.settings.dimensions.width - 1
                let maxy1 = miny1 + c.settings.dimensions.height - 1

                if (maxx2 >= minx1 && minx2 <= maxx1 && maxy2 >= miny1 && miny2 <= maxy1) { // AABB algorithm
                    result = true
                }
            })
            return result
        },

        sidebarBoardClicked(id) {
            this.openBoard(id)
        },

        createNewBoard() {
            let title = "New board"
            let settings = {dimensions: {
                        width: 4,
                        height: 3
                    }}

            let requestPayload = {
                title: title,
                stackId: this.currentStackId,
                settings: JSON.stringify(settings),
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

        initializeBottomSidebar() {
            let self = this
            interact('.card-button-draggable').draggable({
                enabled: true,
                autoScroll: false,
                cursorChecker () {
                    return null
                },

                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: document.body,
                    }),

                ],

                listeners: {
                    move (event) {
                        let target = event.target
                        
                        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                        
                        target.style.webkitTransform =
                            target.style.transform =
                            'translate(' + x + 'px, ' + y + 'px)'

                        target.setAttribute('data-x', x)
                        target.setAttribute('data-y', y)

                        let dropzoneRect = self.$el.querySelector('#dropzone-grid').getBoundingClientRect()
                        // let cardRect = event.rect
                        let cardRect = target.getBoundingClientRect()
                        // console.log(dropzoneRect.right, cardRect.left)
                        self.deactivateAllDropzones()


                        if (dropzoneRect.bottom >= (event.rect.bottom + 20) && dropzoneRect.right >= event.rect.left + 20) {
                        // if (dropzoneRect.bottom >= (cardRect.bottom) && dropzoneRect.right >= cardRect.left) {
                        // if (dropzoneRect.bottom >= (cardRect.bottom - cardRect.height) && dropzoneRect.right >= (cardRect.right - cardRect.width)) {
                            let type = target.getAttribute('data-type')
                            let newCard = self.newCards.find(c => c.type == type)

                            if (target.className !== 'card-on-board') {
                                target.className = ('card-on-board')

                                self.$set(newCard, 'onboard', true)
                                target.style.width = (self.dropzoneGrid.cellWidth)*newCard.width  - 10 + 'px'
                                target.style.height = (self.dropzoneGrid.cellHeight)*newCard.height - 10 + 'px'
                                let nx = x - self.dropzoneGrid.cellWidth*0.3
                                let ny = y - self.dropzoneGrid.cellHeight*0.3
                                target.style.webkitTransform =
                                    target.style.transform =
                                    'translate(' + nx + 'px, ' + ny + 'px)'
                                target.setAttribute('data-x', nx)
                                target.setAttribute('data-y', ny)

                                self.tempCard.w = newCard.width
                                self.tempCard.h = newCard.height

                            } 

                            // console.log(dropzoneRect.bottom, cardRect.bottom, cardRect.height)

                            if (dropzoneRect.bottom >= (cardRect.bottom - cardRect.height) && dropzoneRect.right >= (cardRect.right - cardRect.width)) {

                                // console.log("aaa")

                                let tempX = Math.floor((event.clientX - dropzoneRect.left) / self.dropzoneGrid.cellWidth)
                                let tempY = Math.floor(((event.clientY - dropzoneRect.top) / self.dropzoneGrid.cellHeight))

                                self.tempCard.x = tempX
                                self.tempCard.y = tempY
                                
                                let overlap = self.checkOverlap(-1, tempX, tempY, tempX + newCard.width -1, tempY + newCard.height - 1)
                                self.tempCard.overlap = overlap

                                self.activateDropzonesInArea(tempX, tempY, tempX + newCard.width -1, tempY + newCard.height - 1, overlap)
                            }
                        } 
                        
                    },

                    end (event) {

                        let target = event.target
                        let tempCard = self.tempCard
                        let cardRect = target.getBoundingClientRect()
                        let dropzoneRect = self.$el.querySelector('#dropzone-grid').getBoundingClientRect()


                        // if (!(dropzoneRect.bottom >= cardRect.bottom && dropzoneRect.right >= cardRect.right)) {
                        if (tempCard.overlap || !(dropzoneRect.bottom >= (event.rect.bottom) && dropzoneRect.right >= event.rect.left)) {
                            target.style = null
                            target.className = 'card-button-draggable'

                            target.removeAttribute('data-x')
                            target.removeAttribute('data-y')

                            self.deactivateAllDropzones()

                            return
                        }
                        let cell = self.dropzoneGrid.DOMcells.find(drop => parseInt(drop.getAttribute('column')) === tempCard.x &&
                                                                        parseInt(drop.getAttribute('row')) === tempCard.y
                        )

                        let cellx = parseInt(cell.getAttribute('column'))
                        let celly = parseInt(cell.getAttribute('row'))

                        let ghostx = parseInt(target.getAttribute('data-x'))
                        let ghosty = parseInt(target.getAttribute('data-y'))

                        target.removeAttribute('data-x')
                        target.removeAttribute('data-y')

                        let cellRect = cell.getBoundingClientRect()
                        
                        let dx = !tempCard.overlap ? cardRect.left - cellRect.left : 0
                        let dy = !tempCard.overlap ? cardRect.top - cellRect.top : 0

                        // if (!tempCard.overlap) {
                        target.classList.add('temp-card-delay')

                        target.style.webkitTransform =
                        target.style.transform =
                        'translate(' + (ghostx - dx + 5) + 'px, ' + (ghosty - dy + 5) + 'px)'      

                        let cardType = target.getAttribute('data-type')
                        
                        self.createNewCard(cardType, cellx, celly).then(() => {
                            target.style = null
                            target.className = 'card-button-draggable'

                        })
                        self.tempCard = {}
                        
                        setTimeout(() => {
                            self.deactivateAllDropzones()
                            target.classList.remove('temp-card-delay')
                            // target.style = null

                        }, 200);
                        // } else {
                        //     target.style = null
                        //     target.className = 'card-button-draggable'
                        //     self.deactivateAllDropzones()
                        // }
                    }
                }
            })
        },

        cardsSetFocus(start) {
            
            if (start) {
                this.cardsHaveFocus = false
            } else {
                this.cardsHaveFocus = true
            }
        },


        menuPullClick() {
            if (this.isMenuOpen) {
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

            } else {
                this.$el.querySelector('#menu-container').style["max-height"] = 1500 + 'px'
                this.$el.querySelector('#menu-pull').style["background-color"] = "rgba(0, 0, 0, 0.45)"
                this.isMenuOpen = true
            }

        },

        menuLoginClick() {
            if (this.subMenu === 'menu-login') {
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'

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
                
                this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
            }, 0)
        },

        inviteDropdown() {
            this.subMenu = "menu-invite"
            setTimeout(() => {
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 600 + 'px'
                
                this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
            }, 0)
        },

        userLoggedIn(user) {
            this.user = user
            this.menuTitle = "Welcome, " + user.name.split(' ')[0]

            if (this.user.role === 'tutor') {
                this.menuStudentsClick()
            } else {
                this.menuStudentDashboardClick()
                // this.$el.querySelector('#menu-title').style.opacity = 0
                // setTimeout(() => {
                //     this.menuTitle = "Select a board"
                //     this.$el.querySelector('#menu-title').style.opacity = 1
                    
                // }, 1000);
            }
            
        },

        setLayrTitle(title) {
            this.menuTitle = title
        },

        menuStudentsClick() {
            if (this.subMenu === "menu-students") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                if (this.subMenu === "menu-personal") this.$el.querySelector('#menu-personal-button').style["background-color"] = ""
                this.subMenu = "menu-students"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'

                    
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
            }
        },


        menuStudentDashboardClick() {
            if (this.subMenu === "menu-student-dashboard") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                this.subMenu = "menu-student-dashboard"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
            }
        },

        menuHelpClick() {
            if (this.subMenu === "menu-help") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                this.subMenu = "menu-help"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
            }
        },

        menuPersonalClick() {
            if (this.subMenu === "menu-personal") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                if (this.subMenu === "menu-students") this.$el.querySelector('#menu-students-button').style["background-color"] = ""

                this.subMenu = "menu-personal"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 800 + 'px'

                    
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
            }
        },

        settingsMenu() {
            screenfull.toggle(); 
        },

        menuStacksClick() {
            if (this.subMenu === "menu-boards") {
                               
                this.$el.querySelector('#sub-menu-container').style["max-height"] = 0 + 'px'
                this.$el.querySelector('#sub-menu').style["margin-top"] = 0 + 'px'
                
                setTimeout(() => {
                    this.subMenu = null
                }, 400);
            } else {
                this.subMenu = "menu-boards"
                setTimeout(() => {
                    this.$el.querySelector('#sub-menu-container').style["max-height"] = 400 + 'px'

                    
                    this.$el.querySelector('#sub-menu').style["margin-top"] = 5 + 'px'        
                }, 0)
            }
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
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 1,
                                "height": 1,
                            },
                            "program": "gallery",

                        
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
                            "dimensions": {
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 1,
                                "height": 1,
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
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 1,
                                "height": 1,
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
                            "title": "Notes"
                        },

                        "display": {
                            "icon": require('@/assets/cards/icons/text.svg'),
                        },
                        "settings": {
                            "dimensions": {
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 1,
                                "height": 2,
                            },  
                            "program": "texteditor",
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
                            "dimensions": {
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 1,
                                "height": 2,
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
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 2,
                                "height": 2,
                            },
                            "program": "youtubeplayer",
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
                            "dimensions": {
                                "x": card.settings.dimensions.x,
                                "y": card.settings.dimensions.y,
                                "width": 2,
                                "height": 2,
                            },  
                            "program": "whiteboard",
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

            switch (this.subMenu) {
                case 'menu-login':
                    this.menuLoginClick()
                    break
                case 'menu-students':
                    this.menuStudentsClick()
                    break
                case 'menu-boards':
                    this.menuStacksClick()
                    break
                case 'menu-personal':
                    this.menuPersonalClick()
                    break
                case 'menu-student-dashboard':
                    this.menuStudentDashboardClick()
                    break
            }

            console.log(this.subMenu)

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
            this.currentStack = stack
            this.openBoard(stack.boards[0].info.id)
            this.stackDataLoaded = true
            this.initializeBottomSidebar()
            this.menuTitle = stack.info.title

        },

        openBoard(id) {
            this.boardUnload = true
            this.$nextTick(() => {

                this.currentBoardId = id
                this.processCards(this.currentBoard.cards)
                this.dropzoneGridSetup()
                this.$nextTick(() => this.windowResized())
                this.$nextTick(() => {
                    this.dropzoneGrid.DOMcells = this.$refs['dropzone-cell']
                    this.dropzoneGrid.height = this.currentBoard.settings.dimensions.height
                    this.dropzoneGrid.width = this.currentBoard.settings.dimensions.width
                    this.boardUnload = false

                } )
            })
        },

        createNewCard(cardType, x, y) {
            if (this.user === "guest") {
                return
            }

            let card = this.newCards.find(c=>c.type == cardType)


            let newCardDefaults = this.cardTemplate(
                {
                    "info": {
                        "type": card.type
                    },
                    "settings": {
                        "program": card.program,
                        "dimensions": {
                            x, y,
                            "height": card.height,
                            "width": card.width
                        }
                    },
                }
            )            

            let requestPayload = {
                type: card.type,
                boardId: this.currentBoard.info.id,
                title: newCardDefaults.info.title,
                settings: JSON.stringify(newCardDefaults.settings),
                content: newCardDefaults.content,
            }      
            
            // console.log(requestPayload)
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

        boardDivClicked() {
            if (this.subMenu) {
                this.menuPullClick()
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
    /* height: 40px; */
    /* display: flex; */
    /* flex-direction: row; */
    /* align-items: center; */
    /* justify-content: center; */
    /* margin-bottom: 5px; */
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
    color: white;
    text-decoration: underline;
    /* font-weight: bold; */
    color: lightgreen;
}

.horizontal-line {
    border-top: 1px solid black;
    margin-top: 5px;
    width: 100%;
}




#layr {
    display: grid;
    width: 100%;
    height: 100vh;
    grid-template-columns: 30px minmax(0, 1fr) 30px;
    grid-template-rows: 70px minmax(0, 1fr) 70px;
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

#dropzone-grid {
    display: grid;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 100;
    outline: solid 3px rgba(235, 235, 235, 0.2);
    /* box-shadow: 0px 0px 0px 3px red; */
    grid-area: 1 / 1 / 4 / 4;
}

#layout-grid {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 200;
    display: grid;
    overflow: hidden;
    grid-area: 2 / 2 / 3 / 3;
}

.dropzone {
    box-shadow: 0px 0px 0px 0.5px rgba(235, 235, 235, 0.2);
}

.dropzone-placeholder {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border-style: solid;
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


#sidebar-bottom {
    /* width: 40%; */
    grid-area: 3 / 2 / 4 / 3;
    border-radius: 10px;
    justify-self: center;
    background-color: rgba(0, 0, 0, 0.3);
    margin-top: 5px;

    display: grid;
    grid-template-columns: 50px minmax(0, 1fr) 50px;
    grid-template-rows: 10px minmax(0, 1fr) 10px;

}

#card-carousel, #card-carousel-ghost {
    grid-area: 2 / 2 / 3 / 3;
    /* background-color: red; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

#card-carousel {
    z-index: 300;
}

#card-carousel-ghost {
    z-index: 200;
}


.card-button-draggable, .card-button-ghost {
    width: 65px;
    height: 45px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 5px;
    cursor: grab;
    user-select: none;
    touch-action: none;
}

.card-button:active {
    cursor: grabbing;
}

.card-button img, .card-button-ghost img {
    height: 25px;
    transition: all 0.2s;  
}

.card-button p, .card-button-ghost p {
    font-size: 14px;
    transition: all 0.2s;    

}

.card-button-ghost {
    opacity: 0.5;
}

.card-on-board {
    /* width: 200px; */
    /* height: 200px; */
    height: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    border: 5px white solid;
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 2px 0 black;
    user-select: none;
    overflow: hidden;

}

.card-on-board img {
    height: 60px;
}

.card-on-board p {
    font-size: 20px;
}


.card-button {
    touch-action: none;
    max-width: 75px;
    max-height: 55px;
    min-width: 75px;
    min-height: 55px;
    
}

.temp-card-delay {
    transition: all 0.2s;
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
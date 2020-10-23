<template>
    <div class="personal">
        
        <div class="public-boards container-common">
            
            <div class="public-boards-title title-common">
                <h1>Your Public Boards</h1>
            </div>
            <div class="boards-menu-carousel">
                <menu-boards @subMenuBoardClicked="selectBoard" 
                                @subMenuBoardNewBoard="createBoard" 
                                :createBoard='true' 
                                :boards="publicBoards"
                                :flexDirection="'row'"
                                >
                                
                </menu-boards>
            </div>
        </div>
        

        <div class="private-boards container-common">
            <div class="private-boards-title title-common">
                <h1>Your Private Boards</h1>
            </div>

            <div class="boards-menu-carousel">
                <menu-boards @subMenuBoardClicked="selectBoard" 
                                @subMenuBoardNewBoard="createBoard" 
                                :createBoard='true' 
                                :boards="privateBoards"
                                :flexDirection="'row'"
                                >
                                
                </menu-boards>
            </div>
        
        </div>


    </div>
    
</template>

<script>
export default {
    // name: 'menu-boards'
    props: {
        // boards: {
        //     required: true,
        //     // type: [Array, Null]
        // }
        public: {
            type: Boolean
        }
    },

    data() {
        return {
            boards: null,
        }
    },

    computed: {
        publicBoards() {
            return this.boards ? this.boards.filter(b=>b.info.public === true).sort(function(a, b) {
                                        let ta = new Date(a.info.created_at)
                                        let tb = new Date(b.info.created_at)
                                        return tb.getTime() - ta.getTime()
                                    })

                                : null
        },

        privateBoards() {
            return this.boards ? this.boards.filter(b=>b.info.public === null || b.info.public === false).sort(function(a, b) {
                                        let ta = new Date(a.info.created_at)
                                        let tb = new Date(b.info.created_at)
                                        return tb.getTime() - ta.getTime()
                                    })

                                : null
        }
    },

    created() {
        if (this.public) this.loadPublicBoards()
        else this.loadAllBoards()


    },

    methods: {
        boardClicked(id) {
            this.$emit('subMenuBoardClicked', id)
        },

        loadAllBoards() {
            this.$http.get('/api/boards').then((response) => {
                console.log("API BOARDS RESPONSE", response.data)
                this.boards = response.data.boards
            })
        },

        loadPublicBoards() {
            let parts = location.hostname.split('.')
            let userSubdomain = parts[parts.length-3]
            this.$http.get('/api/subdomains/' + userSubdomain).then((response) => {
                console.log("API SUBDOMAINS RESPONSE", response.data)
                this.boards = response.data.public.boards
            })
        },

        convertTimeToDate(date) {
            if (!date) return
            let d = new Date(date)
            let intl = new Intl.DateTimeFormat('en-US').format(d)
            return intl
        },        
        
        convertBoardTime(date) {
            let d = new Date(date)
            let options = {
                hour: 'numeric', minute: 'numeric', second: 'numeric', 
                timeZone: 'Europe/Bratislava',
                // timeZoneName: 'short'
            }
            let intl = new Intl.DateTimeFormat('en-US', options).format(d)
            return intl
        },

        selectBoard(id) {
            this.$emit('subMenuBoardClicked', id)
        },

        createBoard() {
            // let board = this.generateBoards(1)[0]
            let title = "New board"
            let settings = {dimensions: {
                        width: 2000,
                        height: 1000
                    }}
            let requestPayload = {
                title: title,
                studentId: this.selectedStudentId,
                settings: JSON.stringify(settings)
            }

            this.$el.querySelector('#create-board-button').disabled = true
            this.$http.post('/api/boards', requestPayload)
                        .then(response => {
                            let newBoard = response.data.board
                            console.log("API BOARD RESPONSE", response.status)
                            this.boards.push(newBoard)
                            this.$el.querySelector('#create-board-button').disabled = false

                            // this.menuBoardsClick()
                            // this.openBoard(newBoard.id)            
                        })
        },
    },


}
</script>
<style scoped>
.boards-menu-title {
margin-left: 5px;

}
.boards-menu-title h3 {
    color: white;

}

.boards-menu-carousel {
    display: flex;
    flex-direction: row;
    /* width: 100%; */
    /* height: 100px; */
    margin-top: 10px;
    /* padding-bottom: 1px; */
    margin-left: 15px;
    margin-right: 15px;
    overflow: hidden;
    overflow-x: scroll;
}

.boards-menu-carousel::-webkit-scrollbar {
    height: 7px;
    /* margin-top: 5px; */
}

.boards-menu-carousel::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

.boards-menu-carousel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

.boards-menu-carousel::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

}

.boards-menu-carousel-board-icon {
    background-color: white;
    border-radius: 7px;
    height: 100px;
    width: 100%;
    /* flex-direction: column; */
}

.boards-menu-carousel-board-new {
    min-width: 150px;
    max-width: 150px;
    padding: 5px;
    box-sizing: border-box;
    /* height: 100%; */
    margin-right: 35px;
    /* margin-bottom: 3px; */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.boards-menu-carousel-board-new-icon {
    height: 95px;
    width: 100%;
    box-shadow: 0 0 0pt 5px lightgreen;
    margin-left: 5px;
    padding: 3px;
    box-sizing: border-box;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;


}

.boards-menu-carousel-board-new-icon h3 {
    text-align: center;
    color:white
}

.boards-menu-carousel-board {
    min-width: 190px;
    max-width: 190px;
    padding: 2px;
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.boards-menu-carousel-board-title {
    overflow: hidden;
    width: 100%;
}

.boards-menu-carousel-board-title h3 {
    color: white;
    font-size: 18px;
    margin-top: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

.boards-list-carousel-board-icon-description {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.boards-list-carousel-board-icon-description p {
    /* margin-left: auto; */
    font-size: 20px;
    font-weight: bold;
}

.personal {
    padding: 10px 20px 10px 20px;
}

.container-common {
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.25);
    /* margin-left: 20px; */
    /* margin-right: 20px; */
}

.title-common {
    background-color: white;
    width: 100%;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 20px;
}

.title-common h1 {
    font-size: 20px;
}

.private-boards {
    margin-top: 30px;
}
</style>

<template>
    <div class="boards-menu-carousel">
        <!-- <div class="boards-menu-carousel-board-new"
                >
            <div class="boards-menu-carousel-board-new-icon"
                    @click="newBoard">
                <h3>Create a <br> new board</h3>
            </div>
            <div class="boards-menu-carousel-board-title">
                <h3 style="font-style: italic">New board</h3>
            </div>
        </div> -->
        <div class="boards-menu-carousel-board" 
                v-for="board in sortedBoards" 
                :key="board.info.id"
                @click="boardClicked(board.info.id)"
                >
            <div class="boards-menu-carousel-board-icon">
                <div class="boards-list-carousel-board-icon-description">
                    <p>{{ convertTimeToDate(board.info.created_at) }}</p>
                    <p>{{ convertBoardTime(board.info.created_at) }}</p>
                </div>
            </div>
            <div class="boards-menu-carousel-board-title">
                <h3>{{ board.info.title }}</h3>
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
    },

    data() {
        return {
            boards: null,
        }
    },

    computed: {
        sortedBoards() {
            return this.boards ? this.boards.filter(b=>b).sort(function(a, b) {
                                        let ta = new Date(a.info.created_at)
                                        let tb = new Date(b.info.created_at)
                                        return tb.getTime() - ta.getTime()
                                    })

                                : null
            // return this.boards
        },
    },

    created() {
        this.loadBoards()
    },

    methods: {
        boardClicked(id) {
            this.$emit('subMenuBoardClicked', id)
        },

        loadBoards() {
            this.$http.get('/api/boards').then((response) => {
                console.log("API BOARDS RESPONSE", response.data)
                this.boards = response.data.boards
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

        // newBoard() {
        //     this.$emit('subMenuBoardNewBoard')
        // }
    },


}
</script>
<style>
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
</style>

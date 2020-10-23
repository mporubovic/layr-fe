<template>
    <div class="carousel" :ref="'carousel'">
        <button class="carousel-board-new"
                @click="newBoard"
                v-if="createBoard"
                id="create-board-button"
                >
            <div class="carousel-board-new-icon"
                    >
                <img src="@/assets/common/addcirclewhite.svg">
                
                <h3>Create a <br> new board</h3>
            </div>
            <div class="carousel-board-title">
                <!-- <h3 style="font-style: italic">New board</h3> -->
            </div>
        </button>
        <div class="carousel-board" 
                v-for="board in sortedBoards" 
                :key="board.info.id"
                @click="boardClicked(board.info.id)"
                >
            <div class="carousel-board-icon">
                <div class="carousel-board-icon-description">
                    <p>{{ convertTimeToDate(board.info.created_at) }}</p>
                    <p>{{ convertBoardTime(board.info.created_at) }}</p>
                </div>
            </div>
            <div class="carousel-board-title">
                <h3>{{ board.info.title }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // name: 'menu-boards'
    props: {
        boards: {
            // required: true,
            // type: [Array, Null]
        },
        public: {
            type: Boolean
        },

        publicBoards: {
            type: Array
        },

        createBoard: {
            type: Boolean
        },

        flexDirection: {
            type: String
        }
    },

    // data() {
    //     // return {
    //     //     boards: null,
    //     // }
    // },

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

    mounted() {
        if (this.flexDirection === "column") this.$refs.carousel.style['flex-wrap'] = 'wrap'
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

        newBoard() {
            this.$emit('subMenuBoardNewBoard')
        }
    },


}
</script>
<style>
/* .container {
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
} */

.carousel {
    display: flex;
    flex-direction: row;
    /* width: 100%; */
    /* height: 500px; */
    /* margin-top: 10px; */
    /* padding-bottom: 1px; */
    /* margin-left: 15px; */
    /* margin-right: 15px; */
    /* flex-wrap: wrap; */
    /* overflow: hidden; */
    /* overflow-y: scroll; */
    /* box-sizing: border-box; */
}

.carousel-board-icon {
    background-color: white;
    border-radius: 7px;
    height: 100px;
    width: 100%;
    /* flex-direction: column; */
}

.carousel-board-icon-description {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.carousel-board-icon-description p {
    /* margin-left: auto; */
    font-size: 20px;
    font-weight: bold;
}

.carousel-board-new {
    min-width: 190px;
    max-width: 190px;
    padding: 5px;
    box-sizing: border-box;
    /* height: 100%; */
    margin-right: 10px;
    margin-left: 8px;
    background-color: transparent;
    font-size: 16px;
    /* margin-bottom: 3px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;

}

.carousel-board-new-icon {
    height: 95px;
    width: 100%;
    box-shadow: 0 0 0pt 5px lightgreen;
    margin-left: 5px;
    padding: 3px;
    box-sizing: border-box;
    border-radius: 7px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.25);


}

.carousel-board-new-icon h3 {
    text-align: center;
    color:white;
    text-align: left;
    margin-left: 15px;
}

.carousel-board-new-icon img {
    height: 30px;
    /* background-color: white; */
}

.carousel-board {
    min-width: 190px;
    max-width: 190px;
    padding: 2px;
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 15px;
}

.carousel-board-title {
    overflow: hidden;
    width: 100%;
}

.carousel-board-title h3 {
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
</style>

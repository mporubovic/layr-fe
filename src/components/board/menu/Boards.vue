<template>
    <div class="boards-menu-carousel">
        <div class="boards-menu-carousel-board-new"
                >
            <div class="boards-menu-carousel-board-new-icon"
                    @click="newBoard">
                <h3>Create a <br> new board</h3>
            </div>
            <div class="boards-menu-carousel-board-title">
                <!-- <h3 style="font-style: italic">New board</h3> -->
            </div>
        </div>
        <div class="boards-menu-carousel-board" 
                v-for="board in boards" 
                :key="board.info.id"
                @click="boardClicked(board.info.id)"
                >
            <div class="boards-menu-carousel-board-icon">

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
        boards: {
            required: true,
            // type: [Array, Null]
        }
    },

    methods: {
        boardClicked(id) {
            this.$emit('subMenuBoardClicked', id)
        },

        newBoard() {
            this.$emit('subMenuBoardNewBoard')
        }
    }
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
</style>

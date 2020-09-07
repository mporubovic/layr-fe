<template>
    <div class="students">
        <div class="student-list-container containers-common">
            <div class="students-container-header">
                <h1 class="students-container-title">Your Students</h1>
                
            </div>
            <hr class="line-common">
            
            <div class="students-list">
                <div v-for="student in students" :key="student.id" class="students-list-item">
                    
                    <p class="students-list-item-name">{{ student.name }}</p>
                    <button class="students-list-button buttons-common"
                            @click="selectStudent(student.id)">
                        <img src="@/assets/modal/login/next.svg" class="next-icon">
                    </button>
                </div>

            </div>
        </div>

        <div class="boards-list-container containers-common">
            <div class="boards-container-header">
                <h1 class="boards-container-title"> {{ boardContainerTitle }} </h1>
                
            </div>
            <hr class="line-common">
            
            <div class="boards-list-carousel-container">
                <div class="boards-list-carousel">
                    <div class="boards-list-carousel-board-new"
                            >
                        <div class="boards-list-carousel-board-new-icon"
                                >
                            <h3>Create a <br> new board</h3>
                        </div>
                        <div class="boards-list-carousel-board-title">
                            <!-- <h3 style="font-style: italic">New board</h3> -->
                        </div>
                    </div>
                    <div class="boards-list-carousel-board" 
                            v-for="board in boards" 
                            :key="board.info.id"
                            >
                        <div class="boards-list-carousel-board-icon">

                        </div>
                        <div class="boards-list-carousel-board-title">
                            <h3>{{ board.info.title }}</h3>
                        </div>
                    </div>
                </div>
            </div>
                

        </div>

        <div class="student-settings-container containers-common">


        </div>

        <div class="board-settings-container containers-common">

        </div>

    </div>
</template>

<script>

import { loremIpsum } from "lorem-ipsum";

export default {
    // name: 'menu-boards'
    props: {
        students: {
            // type: [Object, Null],
            required: true,
        }
    },

    data() {
        return {
            boards: null,
            selectedStudent: null,
        }
    },

    computed: {
        boardContainerTitle() {
            return this.selectedStudent ? this.selectedStudent.name + '\'s Boards' : 'Select a student on the left'  
        }
    },

    mounted() {
        this.boards = this.generateBoards(15)
    },

    methods: {
        selectStudent() {

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
                
                }
                boards.push(board)
            }
            return boards
        }
    }
}
</script>
<style>
.students {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 4fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    height: 600px;
    padding: 20px;
}



.buttons-common {
    text-decoration: none;
    user-select: none;
    color:black;
    /* font-size: 16px; */
    background-color: white;
    border-radius: 99px;
    /* padding-left: 20px; */
    /* padding-right: 20px; */
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;
    cursor: pointer;
}

.next-icon {
    height: 26px
}

.containers-common {
    border-radius: 10px;
}

.students-container-header {
    margin-top: 5px;
    /* margin-bottom: 5px; */
}

.students-container-title {
    font-size: 25px;
}

.line-common {
    border-top: 1px solid black;
    /* margin-top: 5px; */
    width: 100%;
}

.student-list-container { 
    grid-area: 1 / 1 / 2 / 2; 
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.students-list {
    margin-top: 20px;

}

.students-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
}

.students-list-item-name {
    font-size: 20px;
    text-decoration: underline;
}

.students-list-button {
    height: 35px;
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    
}

.boards-list-container { 
    grid-area: 1 / 2 / 2 / 3; 
    background-color: rgba(0, 0, 0, 0.25);
    overflow: hidden;
    /* overflow: hidden; */
    /* overflow-y: scroll; */

}

.boards-list-carousel-container {
    overflow: hidden;
    height: 410px;
    padding: 10px;
    
    overflow-y: scroll;
}

.boards-container-header {
    padding-top: 5px;
    /* margin-left: 20px; */
    padding-left: 20px;
    background-color: white;
    /* width: 100%; */
}

.boards-container-title {
    font-size: 25px;
}

.boards-list-carousel {
    display: flex;
    flex-direction: row;
    /* width: 100%; */
    /* height: 100px; */
    margin-top: 10px;
    /* padding-bottom: 1px; */
    margin-left: 15px;
    margin-right: 15px;
    flex-wrap: wrap;
    /* overflow: hidden; */
    /* overflow-y: scroll; */
    /* box-sizing: border-box; */
}

.boards-list-carousel-container::-webkit-scrollbar {
    width: 10px;
}

.boards-list-carousel-container::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

.boards-list-carousel-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

.boards-list-carousel-container::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

}

.boards-list-carousel-board-icon {
    background-color: white;
    border-radius: 7px;
    height: 100px;
    width: 100%;
    /* flex-direction: column; */
}

.boards-list-carousel-board-new {
    min-width: 190px;
    max-width: 190px;
    padding: 5px;
    box-sizing: border-box;
    /* height: 100%; */
    margin-right: 20px;
    /* margin-bottom: 3px; */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.boards-list-carousel-board-new-icon {
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

.boards-list-carousel-board-new-icon h3 {
    text-align: center;
    color:white
}

.boards-list-carousel-board {
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

.boards-list-carousel-board-title {
    overflow: hidden;
    width: 100%;
}

.boards-list-carousel-board-title h3 {
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


.student-settings-container { 
    grid-area: 2 / 1 / 3 / 2; 
    background-color: white;

}

.board-settings-container { 
    grid-area: 2 / 2 / 3 / 3; 
    background-color: white;

}

</style>

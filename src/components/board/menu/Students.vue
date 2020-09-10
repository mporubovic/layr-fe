<template>
    <div class="students">
        <div class="student-list-container containers-common">
            <div class="students-container-header">
                <h1 class="students-container-title">Your Students</h1>
                
            </div>
            <hr class="line-common">
            
            <div class="students-list" id="students-list">
                <div v-for="student in students" :key="student.id" class="students-list-item"
                :style="{ 'background-color': selectedStudentId === student.id ? 'lightgreen' : 'white'}">
                    
                    <p class="students-list-item-name"
                        @click.right.prevent="onStudentNameRightClick(student.id)"
                        v-if="studentNameEditingId !== student.id"
                        >
                        {{ student.name }}</p>

                    <input type="text" id="student-name-input" class="students-list-item-name-input"
                            v-if="studentNameEditingId === student.id"
                            @blur="onStudentNameInputBlur($event, student.id)"
                            @keydown.enter="onStudentNameInputKeydownEnter($event, student.id)"
                            autocomplete="off" 
                            maxlength="40"
                            v-bind:value="student.name"
                            >
                    <button class="students-list-button buttons-common"
                            @click="selectStudent(student.id)"
                            >
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
            
            <div class="boards-list-loading" v-if="selectedStudentId && !boards">
                    <p class="boards-list-loading-text">Loading...</p>
                </div>
            
            <div class="boards-list-carousel-container" v-if="boards">

                
                <div class="boards-list-carousel">
                    <button class="boards-list-carousel-board-new"
                            @click="createBoard"
                            id="create-board-button"
                            >
                        <div class="boards-list-carousel-board-new-icon"
                                >
                            <img src="@/assets/common/addcirclewhite.svg">
                            
                            <h3>Create a <br> new board</h3>
                        </div>
                        <div class="boards-list-carousel-board-title">
                            <!-- <h3 style="font-style: italic">New board</h3> -->
                        </div>
                    </button>
                    <div class="boards-list-carousel-board" 
                            v-for="board in sortedBoards" 
                            :key="board.info.id"
                            @click="selectBoard(board.info.id)"
                            >
                        <div class="boards-list-carousel-board-icon">
                            <div class="boards-list-carousel-board-icon-description">
                                <p>{{ convertTimeToDate(board.info.created_at) }}</p>
                                <p>{{ convertBoardTime(board.info.created_at) }}</p>
                            </div>
                        </div>
                        <div class="boards-list-carousel-board-title">
                            <h3>{{ board.info.title }}</h3>
                        </div>
                    </div>
                </div>
            </div>
                

        </div>

        <div class="student-settings-container containers-common">
            <button class="student-add-student-button buttons-common"
                    @click="newStudentClicked"
                    v-if="!isNewStudentFormVisible && !newStudentPinCode"
                >
                <img src="@/assets/common/addcircle.svg">
                <p>New Student</p>
            </button>
            <p class="student-add-student-count" v-if="!isNewStudentFormVisible && students && !newStudentPinCode">{{ students.length }} / 99 Students</p>

            <div class="student-new-student-form"
            v-if="isNewStudentFormVisible"
            >
                <input id="new-student-name-input" type="text" class="new-student-name-input student-input-common" placeholder="Student Name">
                <input id="new-student-email-input" type="email" class="new-student-email-input student-input-common" 
                        placeholder="Student Email" 
                        spellcheck="false">
                <button class="new-student-form-button buttons-common" id="new-student-form-button"
                        @click="createNewStudentClicked"
                    >
                    Create new student
                </button>
            </div>

            <div class="student-new-student-pin-code" v-if="newStudentPinCode">
                <div class="new-student-pin-code-title">
                    <p>Your new student's PIN Code</p>
                    <!-- <p>PIN Code</p> -->
                </div>

                <div class="new-student-pin-code-code">
                    <p>{{ newStudentPinCodeFormatted }}</p>
                </div>

                <div class="new-student-pin-code-buttons">
                    <button class="new-student-pin-code-instructions buttons-common">
                        <img src="@/assets/common/info.svg">
                        <p>Instructions</p>
                    </button>

                    <button class="new-student-pin-code-ok buttons-common"
                            @click="newStudentOkClicked">
                        <img src="@/assets/common/tickcircle.svg">
                        <p>OK</p>
                    </button>
                </div>
            </div>
        </div>

        <div class="board-settings-container containers-common">
            <div class="student-info" v-if="selectedStudent">
                <p>Student ID: {{ selectedStudent.id }}</p>
                <p>Registered on: {{ convertTimeToDate(selectedStudent.created_at) }}</p> 
                <p>Email: {{ selectedStudent.email }}</p> 

                <div class="student-controls">
                    <button class="student-controls-reset-pin-code buttons-common" 
                            v-if="!studentResetPinCode"
                            @click="resetStudentPinCode"
                            >
                        Reset Student PIN Code
                    </button>
                    <div class="student-controls-reset-pin-code-new" v-if="studentResetPinCode">
                        <p>New PIN Code:</p>
                        <p class="student-controls-reset-pin-code-new-text">{{ studentResetPinCodeFormatted }}</p>
                    </div>
                </div>
            

            </div>
        </div>

    </div>
</template>

<script>

import { loremIpsum } from "lorem-ipsum";

export default {
    // name: 'menu-boards'
    props: {
        // students: {
        //     // type: [Object, Null],
        //     required: true,
        // }
        // boards,
    },

    data() {
        return {
            boards: null,
            students: [],
            // students: null,
            selectedStudentId: null,
            studentNameEditingId: null,
            isNewStudentFormVisible: false,
            newStudentPinCode: null,
            studentResetPinCode: null,
        }
    },

    computed: {
        selectedStudent() {
            return this.students.find(s => s.id === this.selectedStudentId)
        },
        
        boardContainerTitle() {
            return this.selectedStudent ? this.selectedStudent.name + '\'s boards' : 'Select a student on the left'  
        },

        sortedBoards() {
            return this.boards.filter(b=>b).sort(function(a, b) {
                                        let ta = new Date(a.info.created_at)
                                        let tb = new Date(b.info.created_at)
                                        return tb.getTime() - ta.getTime()
                                    });
            // return this.boards
        },

        newStudentPinCodeFormatted() {
            if (this.newStudentPinCode) {
                let s = this.newStudentPinCode.toString().split('')
                s.splice(3, 0, "  ")
                return s.join('')
            } else {
                return null
            }
        },

        studentResetPinCodeFormatted() {
            if (this.studentResetPinCode) {
                let s = this.studentResetPinCode.toString().split('')
                s.splice(3, 0, "  ")
                return s.join('')
            } else {
                return null
            }
        },


    },

    created() {
        // this.boards = this.generateBoards(15)
        this.loadStudents()
    },

    methods: {
        loadStudents() {
            this.$http.get('/api/students').then((response) => {
                console.log('API STUDENTS RESPONSE DATA', response.data)
                this.students = response.data.students
            })
        },
        
        selectStudent(id) {
            this.selectedStudentId = id
            if (this.newStudentPinCode) this.newStudentPinCode = null
            if (this.studentResetPinCode) this.studentResetPinCode = null
            if (this.boards) this.boards = null
            // this.$refs['students-list-item-' + id][0].style['background-color'] = 'lightgreen'
            this.$http.get('/api/students/' + id).then((response) => {
                console.log('API STUDENT RESPONSE ', response.data)
                let student = response.data.student
                let boards = student.boards
                this.boards = boards
                // this.$emit
            })
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
            let requestPayload = {
                title: title,
                studentId: this.selectedStudentId
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

        onStudentNameRightClick(id) {
            this.studentNameEditingId = id
            this.$nextTick(() => {
                this.$el.querySelector('#student-name-input').focus()
            })
            },

        onStudentNameInputBlur(event, id) {
            let newName = event.target.value
            this.studentNameEditingId = null
            console.log("UPDATE STUDENT ", id, " TO ", newName)
            this.students.find(s => s.id === id).name = newName
            
            let requestPayload = {
                name: newName
            }

            this.$http.patch('/api/students/' + id, requestPayload).then((response) => {
                console.log("API STUDENT RESPOSNE", response.status)
            })
        },

        onStudentNameInputKeydownEnter() {
            this.$el.querySelector('#student-name-input').blur()
        },

        newStudentClicked() {
            this.isNewStudentFormVisible = true
        },

        createNewStudentClicked() {
            this.$el.querySelector('#new-student-form-button').disabled = true
            
            let name = this.$el.querySelector('#new-student-name-input').value
            let email = this.$el.querySelector('#new-student-email-input').value
            let password = this.generatePinCode()

            if (!name || !email) {
                return
            }

            let requestPayload = {
                name,
                email,
                password
            }

            console.log("REQUEST PAYLOAD", requestPayload)


            this.$http.post('/api/students', requestPayload).then((response) => {
                console.log("API STUDENTS CREATE RESPONSE", response.data)
                let newStudent = response.data.student
                // this.loadStudents()
                this.students.push(newStudent)
                this.isNewStudentFormVisible = false
                this.$nextTick(() => {
                    let el = this.$el.querySelector('#students-list')
                    el.scrollTop = el.scrollHeight

                })

                this.newStudentPinCode = password

            })
        },

        generatePinCode() {
            return Math.floor(100000 + Math.random() * 900000)
        },

        newStudentOkClicked() {
            this.newStudentPinCode = null
        },

        resetStudentPinCode() {
            let id = this.selectedStudentId
            let password = this.generatePinCode()
            this.studentResetPinCode = password

            let requestPayload = {
                password: password
            }

            this.$http.patch('/api/students/' + id, requestPayload).then((response) => {
                console.log("API STUDENT RESPOSNE", response.status)
            })

        }


    }
}
</script>
<style>
.students {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 3fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    height: 700px;
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

.buttons-common:hover:not([disabled]) {
    box-shadow: 0 0 0pt 2pt lightgreen;

}

.next-icon {
    height: 26px
}

.containers-common {
    border-radius: 10px;
}

.students-container-header {
    padding-top: 5px;
    background-color: white;
    width: 100%;
    /* height: 40px; */
    display: flex;
    flex-direction: row;
    /* align-items: center; */
    justify-content: center;
    /* margin-bottom: 5px; */
}

.students-container-title {
    font-size: 25px;
    /* margin-left: auto; */
    /* width: 100%; */
}

.line-common {
    border-top: 1px solid black;
    /* margin-top: 5px; */
    width: 100%;
}

.student-list-container { 
    grid-area: 1 / 1 / 2 / 2; 
    /* box-sizing: border-box; */
    overflow: hidden;
    /* overflow-y: scroll; */
    /* background-color: white; */
    display: flex;
    flex-direction: column;
    /* align-items: center; */
}

.students-list {
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    height: 100%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.25);

}

.students-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    background-color: white;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 6px;
    /* box-sizing: border-box; */
}

.students-list-item-name {
    font-size: 20px;
    text-decoration: underline;
    /* width: 80%; */
    width: 220px;
    /* background-color: yellow; */
}

.students-list-item-name-input {
    font-size: 20px;
    font-style: italic;
    /* width: 80%; */
    width: 220px;

    /* background-color: red; */
    /* margin-left: 10px; */

}

.students-list-button {
    height: 35px;
    width: 35px;
    min-width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* margin-left: 10px; */
    margin-right: 10px;
    
}

.boards-list-loading {
    margin-top: 10px;
    margin-left: 10px;
}

.boards-list-loading-text {
    color: white;
    font-size: 25px;
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

.boards-list-carousel-container::-webkit-scrollbar, .students-list::-webkit-scrollbar {
    width: 10px;
}

.boards-list-carousel-container::-webkit-scrollbar-track, .students-list::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

.boards-list-carousel-container::-webkit-scrollbar-thumb, .students-list::-webkit-scrollbar-thumb{
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

.boards-list-carousel-container::-webkit-scrollbar-thumb:hover, .students-list::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

}

.boards-list-carousel-board-icon {
    background-color: white;
    border-radius: 7px;
    height: 100px;
    width: 100%;
    /* flex-direction: column; */
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

.boards-list-carousel-board-new {
    min-width: 190px;
    max-width: 190px;
    padding: 5px;
    box-sizing: border-box;
    /* height: 100%; */
    margin-right: 20px;
    background-color: transparent;
    font-size: 16px;
    /* margin-bottom: 3px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;

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
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;



}

.boards-list-carousel-board-new-icon h3 {
    text-align: center;
    color:white;
    text-align: left;
    margin-left: 15px;
}

.boards-list-carousel-board-new-icon img {
    height: 30px;
    /* background-color: white; */
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
    margin-bottom: 15px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

}

.student-add-student-button {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.student-add-student-count {
    position: absolute;
    bottom: 40px;
    font-size: 20px;
}

.student-add-student-button p {
    font-size: 20px;
    margin-left: 10px;
}

.student-add-student-button img {
    height: 25px;

}

.student-input-common {
    width: 100%;
    max-height: 40px;
    box-sizing: border-box;
    /* flex: 1; */
    background-color: lightgray;
    padding: 14px 18px;
    font-size: 20px;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 1px 1px 3px 0 rgba(255, 255, 255, 0.1);
    transition: padding 0.15s, box-shadow 0.15s;
    margin-bottom: 10px;
}

.student-input-common:hover:not([disabled]) {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
            1px 1px 3px 0 rgba(255, 255, 255, 0.1),
            0 0 0 2px lightskyblue;
}

.student-input-common:focus {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
            1px 1px 3px 0 rgba(255, 255, 255, 0.1),
            0 0 0 2px lightskyblue;
}

.student-new-student-form {
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    align-items: center;
}

.new-student-form-button {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 5px;
    /* margin-left: auto; */
    font-size: 18px;

}

.student-new-student-pin-code {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.new-student-pin-code-title {
    display: flex;
    flex-direction: column;
    align-items: center;

    
}

.new-student-pin-code-title p {
    font-size: 20px;
}

.new-student-pin-code-code {
    margin-top: 10px;
    background-color: lightgray;
    padding-left: 30px;
    padding-right: 30px;
}

.new-student-pin-code-code p {
    font-size: 35px;
    font-weight: bold;
}

.new-student-pin-code-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px
}

.new-student-pin-code-instructions, .new-student-pin-code-ok {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.new-student-pin-code-ok {
    margin-left: 15px;
}

.new-student-pin-code-instructions p, .new-student-pin-code-ok p {
    font-size: 15px;
    margin-left: 10px;
}

.new-student-pin-code-instructions img, .new-student-pin-code-ok img {
    height: 20px;
}



.board-settings-container { 
    grid-area: 2 / 2 / 3 / 3; 
    background-color: white;

}

.student-info {
    padding: 15px;
}

.student-info p {
    font-size: 20px;
}

.student-controls-reset-pin-code {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 15px;
    margin-top: 10px;
}

.student-controls-reset-pin-code-new {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    /* justify-content: center; */
}

.student-controls-reset-pin-code-new-text {
    /* margin-top: 10px; */
    background-color: lightgray;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 35px;
    font-weight: bold;
    margin-left: 10px;
}

</style>

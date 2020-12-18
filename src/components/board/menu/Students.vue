<template>
    <div class="students">
        <div class="student-list-container containers-common">
            <div class="container-header">
                Your Students
                
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

        <div class="stacks-list-container containers-common">
            <div class="container-header">
                {{ stackContainerTitle }}
                
            </div>
            <hr class="line-common">
            
            <div class="stacks-list-loading" v-if="selectedStudentId && !stacks">
                    <p class="stacks-list-loading-text">Loading...</p>
                </div>
            
            <div class="stacks-list-carousel-container" v-if="stacks">

                <menu-stacks @subMenuStackClicked="selectStack" 
                                @subMenuStackNewStack="createStack" 
                                @stackUpdatedItself="stackUpdatedItself"
                                :createStack='true' 
                                :stacks="stacks"
                                :groupBy="'category'"
                                :flexDirection="'column'"
                                :userTags="user.tags"
                                >
                                
                </menu-stacks>
            </div>
                

        </div>

        <div class="student-settings-container containers-common">
            <button class="student-add-student-button buttons-common"
                    @click="newStudentClicked"
                    v-if="!isNewStudentFormVisible && !newStudentInvited"
                >
                <img src="@/assets/common/addcircle.svg">
                <p>New Student</p>
            </button>
            <p class="student-add-student-count" v-if="!isNewStudentFormVisible && students && !newStudentInvited">{{ students.length }} / 20 Students</p>

            <div class="student-new-student-form"
            v-if="isNewStudentFormVisible"
            >
                <input id="new-student-name-input" type="text" class="new-student-name-input student-input-common" placeholder="Student Name" autocomplete="off">
                <input id="new-student-email-input" type="email" class="new-student-email-input student-input-common" 
                        placeholder="Student Email" 
                        spellcheck="false"
                        autocomplete="off"
                        >
                <button class="new-student-form-button buttons-common" id="new-student-form-button"
                        @click="createNewStudent"
                    >
                    Invite student
                </button>
            </div>

            <div class="student-new-student-confirmation" v-if="newStudentInvited">
                <div class="student-new-student-confirmation-text">
                Your student will receive an email with login instructions. In the meantime, you can start preparing lessons for them.
                    
                </div>                
                <button class="new-student-ok buttons-common"
                        @click="newStudentOkClicked">
                    <img src="@/assets/common/tickcircle.svg">
                    <p>OK</p>
                </button>
            
            </div>
        </div>

        <div class="stack-settings-container containers-common">
            <div class="student-info" v-if="selectedStudent">
                <!-- <p>Student ID: {{ selectedStudent.id }}</p> -->
                <p>Email: {{ selectedStudent.email }}</p> 
                <p v-if="selectedStudent.email_verified_at">Registered on: {{ convertTimeToDate(selectedStudent.created_at) }}</p> 
                <p v-if="!selectedStudent.email_verified_at">Invite sent on: {{ convertTimeToDate(selectedStudent.created_at) }} <br> The student has not accepted the invite yet.</p> 

                <div class="student-controls">

                </div>
            

            </div>
        </div>

    </div>
</template>

<script>

// import { loremIpsum } from "lorem-ipsum";

export default {
    // name: 'menu-stacks'
    props: {
        // students: {
        //     // type: [Object, Null],
        //     required: true,
        // }
        // stacks,

        user: {
            type: Object
        }
    },

    data() {
        return {
            stacks: null,
            students: [],
            // students: null,
            selectedStudentId: null,
            studentNameEditingId: null,
            isNewStudentFormVisible: false,
            newStudentInvited: false,
        }
    },

    computed: {
        selectedStudent() {
            return this.students.find(s => s.id === this.selectedStudentId)
        },
        
        stackContainerTitle() {
            return this.selectedStudent ? this.selectedStudent.name + '\'s stacks' : 'Select a student on the left'  
        },

        sortedStacks() {
            return this.stacks.filter(b=>b).sort(function(a, b) {
                                        let ta = new Date(a.info.created_at)
                                        let tb = new Date(b.info.created_at)
                                        return tb.getTime() - ta.getTime()
                                    });
            // return this.stacks
        },


    },

    created() {
        // this.stacks = this.generateStacks(15)
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
            if (this.stacks) this.stacks = null
            // this.$refs['students-list-item-' + id][0].style['background-color'] = 'lightgreen'
            this.$http.get('/api/students/' + id).then((response) => {
                console.log('API STUDENT RESPONSE ', response.data)
                let student = response.data.student
                let stacks = student.stacks
                this.stacks = stacks
                // this.$emit
            })
        },

        convertTimeToDate(date) {
            if (!date) return
            let d = new Date(date)
            let intl = new Intl.DateTimeFormat('en-US').format(d)
            return intl
        },        
        
        convertStackTime(date) {
            let d = new Date(date)
            let options = {
                hour: 'numeric', minute: 'numeric', second: 'numeric', 
                timeZone: 'Europe/Bratislava',
                // timeZoneName: 'short'
            }
            let intl = new Intl.DateTimeFormat('en-US', options).format(d)
            return intl
        },

        selectStack(id) {
            this.$emit('subMenuStackClicked', id)
        },

        stackUpdatedItself(id, path, value) {
            this.$emit('subMenuStackUpdatedItself', id, path, value)

        },

        createStack() {
            // let stack = this.generateStacks(1)[0]
            let title = "New stack"

            let requestPayload = {
                title: title,
                studentId: this.selectedStudentId,
            }


            this.$el.querySelector('#new-stack-button').disabled = true
            this.$http.post('/api/stacks', requestPayload)
                        .then(response => {
                            let newStack = response.data.stack
                            console.log("API STACK RESPONSE", response.status)
                            this.stacks.push(newStack)
                            this.$el.querySelector('#new-stack-button').disabled = false

                            // this.menuStacksClick()
                            // this.openStack(newStack.id)            
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

        newStudentOkClicked() {
            this.newStudentInvited = false
            // this.isNewStudentFormVisible = false
            // this.$el.querySelector('#new-stack-button').disabled = false

        },

        createNewStudent() {
            
            let name = this.$el.querySelector('#new-student-name-input').value
            let email = this.$el.querySelector('#new-student-email-input').value

            if (!name || !email) {
                return
            }
                
                
            // this.$el.querySelector('#new-student-form-button').disabled = true
            this.isNewStudentFormVisible = false
            this.newStudentInvited = true


            let requestPayload = {
                name,
                email,
            }

            console.log("REQUEST PAYLOAD", requestPayload)


            this.$http.post('/api/students', requestPayload).then((response) => {
                console.log("API STUDENTS CREATE RESPONSE", response.data)
                let newStudent = response.data.student
                // this.loadStudents()
                this.students.push(newStudent)
                // this.isNewStudentFormVisible = false
                // this.newStudentInvited = true
                this.$el.querySelector('#new-student-form-button').disabled = false

                this.$nextTick(() => {
                    let el = this.$el.querySelector('#students-list')
                    el.scrollTop = el.scrollHeight

                })

            })
        },

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
    height: 700px;
    padding: 20px;
}

.next-icon {
    height: 22px
}



.students-container-title {
    font-size: 16px;
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
    min-width: 220px;
    /* box-sizing: border-box; */
    overflow: hidden;
    /* overflow-y: scroll; */
    /* background-color: white; */
    display: flex;
    flex-direction: column;
    user-select: none;

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

}

.students-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    background-color: white;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 6px;
    /* box-sizing: border-box; */
}

.students-list-item-name {
    font-size: 16px;
    text-decoration: underline;
    /* width: 80%; */
    width: 220px;
    /* background-color: yellow; */
}

.students-list-item-name-input {
    font-size: 16px;
    font-style: italic;
    /* width: 80%; */
    width: 220px;

    /* background-color: red; */
    /* margin-left: 10px; */

}

.students-list-button {
    height: 30px;
    width: 30px;
    min-width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* margin-left: 10px; */
    margin-right: 10px;
    
}

.stacks-list-loading {
    margin-top: 10px;
    margin-left: 10px;
}

.stacks-list-loading-text {
    color: white;
    font-size: 16px;
}

.stacks-list-container { 
    grid-area: 1 / 2 / 2 / 3; 

}


.stacks-container-header {
    padding-top: 5px;
    padding-bottom: 5px;
    /* margin-left: 20px; */
    /* padding-left: 20px; */
    background-color: white;
    /* width: 100%; */
}

.stacks-container-title {
    font-size: 16px;
    margin-left: 20px;
}

/* .stacks-list-carousel-container {
    overflow-y: scroll;
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
} */

.stacks-list-carousel-container {
    overflow-y: scroll;
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
}

.stacks-list-carousel-container::-webkit-scrollbar, .students-list::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.stacks-list-carousel-container::-webkit-scrollbar-track, .students-list::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

.stacks-list-carousel-container::-webkit-scrollbar-thumb, .students-list::-webkit-scrollbar-thumb{
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

.stacks-list-carousel-container::-webkit-scrollbar-thumb:hover, .students-list::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

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
    font-size: 16px;
}

.student-add-student-button p {
    font-size: 16px;
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
    padding: 5px 14px;
    font-size: 16px;
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
    font-size: 16px;

}

.new-student-ok {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.new-student-ok img {
    height: 20px;
}

.new-student-ok p {
    font-size: 14px;
    margin-left: 10px;
}

.student-new-student-confirmation {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.student-new-student-confirmation-text {
    font-size: 14px;
    text-align: center;
    margin-bottom: 15px;
}

.stack-settings-container { 
    grid-area: 2 / 2 / 3 / 3; 
    background-color: white;

}

.student-info {
    padding: 15px;
}

.student-info p {
    font-size: 16px;
}


</style>

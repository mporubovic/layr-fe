<template>
    <div class="login">
        <div class="login-container container-common">
            <div class="login-container-title">
                <h1>Sign in</h1>
                
            </div>
            <hr class="login-container-line">
            
            <div class="login-container-email" v-if="showEmailInput">
                <div class="login-container-email-label">
                    Enter your email
                </div>
                <div class="login-container-input-div-common">
                    <input  @keydown.enter="onSubmitEmailEnter($event)" id="email-input" type="email" class="login-container-email-input input-common" placeholder="Email">
                    <button class="login-container-button-common login-container-next-button"
                            @click="submitEmail"

                                >
                        <img src="@/assets/modal/login/next.svg" class="login-container-next-icon">
                    </button>
                        
                </div>
            </div>
            
            <div class="login-container-password" v-if="showPasswordInput">
            <!-- <div class="login-container-password"> -->
                <div class="login-container-password-label">
                    Enter your password
                </div>
                <div class="login-container-input-div-common">
                    <input @keydown.enter="onTutorLoginEnter($event)" id="password-input" type="password" class="input-common login-container-password-input" placeholder="Password">
                    <button class="login-container-button-common login-container-next-button"
                            @click="tutorLogin"
                        >
                        <img src="@/assets/modal/login/next.svg" class="login-container-next-icon">
                    </button>
                        
                </div>
            </div>
            
            <div class="login-container-pin" v-if="showPINInput">
                <div class="login-container-pin-label">
                    Enter your PIN code (without spaces)
                </div>
                <div class="login-container-input-div-common login-container-pin-input-div">
                    <input   @keydown.enter="onStudentLoginEnter($event)" id="pin-input" type="pin" class="input-common login-container-pin-input" placeholder="PIN Code">
                    <button class="login-container-button-common login-container-next-button"
                            @click="studentLogin"
                    
                    >
                        <img src="@/assets/modal/login/next.svg" class="login-container-next-icon">
                    </button>
                        
                </div>
            </div>
            
            
            <!-- <div class="login-container-pin-input-div">
                <div class="login-container-pin-input-key">
                    9
                </div>
                <div class="login-container-pin-input-key">
                    8
                </div>
                <div class="login-container-pin-input-key">
                    7
                </div>
                <div class="login-container-pin-input-key">
                    6
                </div>
                <div class="login-container-pin-input-key">
                    5
                </div>
                <div class="login-container-pin-input-key">
                    4
                </div>
                <div class="login-container-pin-input-key">
                    3
                </div>
                <div class="login-container-pin-input-key">
                    2
                </div>
                <div class="login-container-pin-input-key">
                    1
                </div>
                <div class="login-container-pin-input-key login-container-pin-input-key-last">
                    0
                </div>
            </div> -->

        </div>

        <div class="boards-container container-common" v-if="publicBoards !== undefined && publicBoards.length != 0">
            <div class="boards-container-title">
                <h1>Public boards</h1>
            </div>

            <div class="board-carousel">
                <boards :public='true' :flexDirection="'row'" :boards='publicBoards' @subMenuBoardClicked="boardClicked"></boards>
            </div>

        </div>

    </div>
</template>

<script>
import Boards from './Boards.vue'

export default {
    // name: 'menu-boards'
    components: {
        Boards
    },
    
    props: {

    },

    data() {
        return {
            userRole: null,
            userEmail: null,
            showEmailInput: true,
            publicBoards: [],
        }
    },

    created() {
        let parts = location.hostname.split('.')
        let userSubdomain = parts[parts.length-3]
        this.$http.get('/api/subdomains/' + userSubdomain).then((response) => {
            console.log("API SUBDOMAINS RESPONSE", response.data)
            this.publicBoards = response.data.public.boards
            let set = response.data.settings
            if (set) {
                if (set.title) {
                    this.$emit('subdomainHasTitle', set.title)
                }
            }
        })
    },

    computed: {
        showPasswordInput() {
            return this.userRole === "tutor"
        },

        showPINInput() {
            return this.userRole === "student"
        },

    },

    methods: {
        boardClicked(id) {
            this.$emit('subMenuBoardClicked', id)
        },

        newBoard() {
            this.$emit('subMenuBoardNewBoard')
        },

        submitEmail() {
            let email = this.$el.querySelector('#email-input').value

            this.$http.get('/api/auth/login/checkemail/' + email)
                .then(response => {
                    console.log("API CHECKEMAIL GET RESPONSE", response.data )
                    this.userRole = response.data.role
                    this.userEmail = email
                    
                    this.$el.querySelector('#email-input').disabled = true
                    this.$nextTick(()=> {
                        this.showEmailInput = false

                    })
                } )           
        },

        tutorLogin() {
            let email = this.userEmail
            let password = this.$el.querySelector('#password-input').value

            let requestPayload = {
                email: email,
                password: password
            }
            
            // this.$http.get('/api/boards').then((response) => {
            //     console.log(response)
            // })
            this.$http.get('/auth/csrf-cookie').then((response) => {
                console.log("CSRF COOKIE", response)

                // this.$http.get('/api/boards').then((response) => {
                //     console.log(response)
                // })
                // if (response.data === "already_logged_in") {
                //     console.log("ALREADY LOGGED IN")
                //     return this.$emit('loggedIn', 'tutor')
                // }
                this.$http.post('/auth/login', requestPayload)
                    .then(response => {
                        console.log("API LOGIN RESPONSE", response )
                        localStorage.setItem('userLoggedIn', true);
                        this.$http.get('/api/user').then((response) => {
                            let tutor = response.data.user
                            this.$emit('loggedIn', tutor)
                        })
                        
                        
                    } )     

            })
        },        
        
        studentLogin() {
            let email = this.userEmail
            let password = this.$el.querySelector('#pin-input').value

            let requestPayload = {
                email: email,
                password: password
            }

            this.$http.get('/auth/csrf-cookie').then((response) => {
                console.log("CSRF COOKIE", response)
                this.$http.post('/auth/login', requestPayload)
                    .then(response => {
                        console.log("API LOGIN RESPONSE", response )
                        localStorage.setItem('userLoggedIn', true);
                        this.$http.get('/api/user').then((response) => {
                            let student = response.data.user
                            this.$emit('loggedIn', student)
                        })
                        
                        
                    } )     

            })
        },

        onSubmitEmailEnter(e) {
            e.target.blur()
            this.submitEmail()
        },

        onTutorLoginEnter(e) {
            e.target.blur()
            this.tutorLogin()

        },

        onStudentLoginEnter(e) {
            e.target.blur()
            this.studentLogin()

        },
    }
}
</script>
<style>
.login {
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

@media only screen and (max-width: 600px) {
  .login {
        align-items:flex-start;

  }

  .boards-container-title {
        justify-content:left !important;

  }
}

.container-common {
    /* margin-left: auto; */
    /* margin-right: auto; */
    /* margin:auto; */
    /* background-color: white; */
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* align-items: center; */
    border-radius: 10px;

}

.login-container {
    width: 400px;
    background-color: white;
    justify-content: center;
    align-items: center;
}

.login-container-title {
    /* margin-top: 5px; */
    /* margin-bottom: 5px; */
}

.login-container-title h1 {
    font-size: 25px;
}

.login-container-line {
    border-top: 1px solid black;
    margin-top: 5px;
    width: 100%;
}

.login-container-email {
    margin-top: 20px;
    margin-bottom: 30px;
}

.login-container-input-div-common {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.input-common {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    flex: 1;
    background-color: lightgray;
    padding: 14px 18px;
    font-size: 20px;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 1px 1px 3px 0 rgba(255, 255, 255, 0.1);
    transition: padding 0.15s, box-shadow 0.15s;
    margin-top: 10px;
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

.login-container-next-button {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0;
    padding-right: 0;
    height: 45px;
    width: 45px;
    margin-left: 10px;
}

.login-container-button-common {
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

.login-container-button-common:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.login-container-email-next-button img {
    height: 30px;
}

/* .login-container-pin-input-div {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    direction: rtl;
    width: 230px;
} */


.login-container-password {
    margin-top: 20px;
    margin-bottom: 30px;
}

/* .login-container-pin-input-div {
    height: 10px;
} */

.login-container-next-icon {
    height: 30px;
}

.login-container-pin {
    margin-top: 20px;
    margin-bottom: 50px;
}

.login-container-pin-input-key {
    color: black;
    /* border: 2px solid #0076ff; */
    border: 2px solid black;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    font-size: 25px;
    position: relative;
    padding: 30px;
    box-sizing: border-box;
}

.login-container-pin-input-key:hover {
    border: 2px solid lightgreen;
}

.login-container-pin-input-key:active {
    background: rgba(124, 155, 249, 0.3);
}

.login-container-pin-input-key-last {
    grid-column-start: 2;
}

.boards-container {
    height: 250px;
    width: 800px;
    margin-top: 40px;
    background-color: rgba(0, 0, 0, 0.25);
    overflow: hidden;
    /* overflow-x: scroll; */

}

.boards-container-title {
    background-color: white;
    width: 100%;
    display: flex;
    justify-content: center;
    /* margin-bottom: 20px; */

}

.boards-container-title h1 {
    font-size: 25px;
}

.board-carousel {
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
    overflow-x: scroll;
}

.board-carousel::-webkit-scrollbar {
    height: 10px;
}

.board-carousel::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

.board-carousel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

.board-carousel::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

}

</style>

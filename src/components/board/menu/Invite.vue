<template>
    <div class="login">
        <div class="token-container containers-common container-center container-white">
            <div class="container-title">
                Invitation
                
            </div>
            <hr class="horizontal-line">

            <p v-if="tokenError" class="container-text container-text-black">This invitation is not valid.</p>
            
            <div class="container-password" v-if="showPasswordInput">
                <div class="container-text container-text-black">
                    Choose a password (minimum 6 characters)
                </div>
                <input @focus="onInputFocus($event)"  @keydown.enter="onPasswordEnter($event)" id="password-input" type="password" class="input-common main-container-password-input" placeholder="Password">
                <button class="buttons-common button-next"
                        @click="submitPassword"
                    >
                    <p>Continue</p>
                    <img src="@/assets/modal/login/next.svg" class="main-container-next-icon">
                </button>
                        
            </div>
            
        </div>

    </div>
</template>

<script>
// import Boards from './Boards.vue'

export default {
    // name: 'menu-boards'
    // components: {
    //     Boards
    // },
    
    props: {

    },

    data() {
        return {
            userRole: null,
            userEmail: null,
            publicBoards: [],
            showPasswordInput: false,
            tokenError: false,
        }
    },

    computed: {
    },

    mounted() {
        let token = window.location.pathname.split('/')[2]
        this.token = token
        this.$http.get('/auth/csrf-cookie').then((response) => {
            console.log("CSRF COOKIE", response)
            this.submitToken(token)

        })

    },

    methods: {
        submitToken(token) {
            let requestPayload = {
                token: token
            }
            this.$http.post('/api/invite/checktoken', requestPayload)
                .then(response => {
                    console.log("API CHECKTOKEN GET RESPONSE", response.data)
                    this.showPasswordInput = true
                }).catch(() => {
                    this.tokenError = true
                })
        },

        
        submitPassword() {
            let password = this.$el.querySelector('#password-input').value

            if (!password) {
                this.$el.querySelector('#password-input').classList.add('input-common-error')
                return
            }

            let requestPayload = {
                token: this.token,
                password: password
            }

            this.$http.post('/api/invite/accepttoken', requestPayload)
                .then(response => {
                    console.log("API TOKEN RESPONSE", response )
                    localStorage.setItem('userLoggedIn', true);
                    this.$http.get('/api/user').then((response) => {
                        let student = response.data.user
                        this.$router.push('/')
                        this.$emit('loggedIn', student)
                    })
                    
                } ).catch(() => {
                            this.$el.querySelector('#password-input').classList.add('input-common-error')
                        })      

        },

        onSubmitEmailEnter(e) {
            e.target.blur()
            this.submitEmail()
        },

        onPasswordEnter(e) {
            e.target.blur()
            this.submitPassword()

        },

        onInputFocus(e) {
            if (e.target.classList.contains('input-common-error')) e.target.classList.remove('input-common-error')

        }
    }
}
</script>
<style>

/* @media only screen and (max-width: 600px) {
  .login {
        align-items:flex-start;

  }

  .boards-container-title {
        justify-content:left !important;

  }
} */


/* .main-container {
    width: 400px;
    background-color: white;
    justify-content: center;
    align-items: center;
} */

.container-password {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10px;
}

.token-container {
    width: 400px;
}

</style>

<template>
    <div class="reset-password">
        <div class="containers-common container-center container-white container-padding"> 
            <div class="container-title">
                Password Reset
            </div>
            <hr class="horizontal-line">
            <div class="email-input container-flex-column container-center" v-if="token === null">
                <div class="input-fields">
                <input @focus="onInputFocus($event)" id="reset-email-input" @keydown.enter="onEmailEnter($event)" type="email" class="input-common" placeholder="Your Email">
                </div>

                <div class="form-message form-message-padding " v-show="emailSubmitted">
                    <img src="@/assets/common/checkcirclegreen.svg" class="misc-icon">
                    You will receive an email shortly
                </div>
                <button class="buttons-common" id="reset-button" v-show="!emailSubmitted"
                                @click="submitEmail"
                    >
                    <p>Send reset instructions</p>
                    <!-- <img src="@/assets/modal/login/next.svg" class="signinup-next-icon"> -->
                </button>
            </div>

            <div class="password-input container-flex-column container-center" v-else>
                <div class="input-fields">
                <input @focus="onInputFocus($event)" id="reset-password-input" type="password" class="input-common" placeholder="New Password">
                <input @focus="onInputFocus($event)" id="reset-password-confirm-input" @keydown.enter="onPasswordEnter($event)" type="password" class="input-common" placeholder="Confirm Password">
                </div>

                <button class="buttons-common" id="reset-button"
                                @click="submitNewPassword"
                    >
                    <p>Set new password</p>
                    <!-- <img src="@/assets/modal/login/next.svg" class="signinup-next-icon"> -->
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
            token: null,
            emailSubmitted: false,
        }
    },

    mounted() {
        let path = window.location.pathname
        let parts = path.split('/')

        if (parts[2]) this.token = parts[2]
    },

    methods: {
        submitEmail() {
            let email = this.$el.querySelector('#reset-email-input').value
            if (!email) {
                this.$el.querySelector('#reset-email-input').classList.add('input-common-error')
                return
            }

            // this.$el.querySelector('#reset-button').disabled = true

            let requestPayload = {
                email
            }
        
            this.emailSubmitted = true    

            this.$http.get('/auth/csrf-cookie').then((response) => {
                console.log("CSRF COOKIE", response)
                this.$http.post('/auth/password/email', requestPayload)
            })
        },
        
        onEmailEnter(e) {
            e.target.blur()
            this.submitEmail()
        },

        onPasswordEnter(e) {
            e.target.blur()
            this.submitNewPassword()
        },

        onInputFocus(e) {
            if (e.target.classList.contains('input-common-error')) e.target.classList.remove('input-common-error')

        },

        submitNewPassword() {
            let password = this.$el.querySelector('#reset-password-input').value
            let passwordConfirm = this.$el.querySelector('#reset-password-confirm-input').value


            if (!password) {
                this.$el.querySelector('#reset-password-input').classList.add('input-common-error')
                return
            }

            if (!passwordConfirm) {
                this.$el.querySelector('#reset-password-confirm-input').classList.add('input-common-error')
                return
            }

            if (password !== passwordConfirm) {
                this.$el.querySelector('#reset-password-confirm-input').classList.add('input-common-error')
                return 
            }

            let requestPayload = {
                token: this.token,
                password
            }

            this.$http.get('/auth/csrf-cookie').then((response) => {
                console.log("CSRF COOKIE", response)
                this.$http.post('/auth/password/reset', requestPayload)
                    .then(response => {
                        console.log("AUTH PASSWORD RESET RESPONSE", response)
                        localStorage.setItem('userLoggedIn', true);
                        this.$http.get('/api/user').then((response) => {
                            let user = response.data.user
                            this.$emit('loggedIn', user)
                            this.$router.push('/')

                        })
                    } ).catch((error) => {
                            console.debug(error)
                        })     
            })
        }
    }
}
</script>
<style>
.reset-password {
    /* height: 500px; */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
    padding-bottom: 50px;
    /* flex-wrap: wrap; */
}

@media only screen and (max-width: 700px) {
  .reset-password {
    flex-direction: column;

  }


}

.signinup-container-common {
    /* margin-left: auto; */
    /* margin-right: auto; */
    /* margin:auto; */
    /* background-color: white; */
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* align-items: center; */
    border-radius: 8px;
    /* width: 380px; */
    /* padding-left: 50px; */
    /* padding-right: 50px; */
    padding-bottom: 10px;
    background-color: white;
    /* justify-content: center; */
    align-items: center;

}


.signinup-input-div-common {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.input-fields {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
    padding-left: 70px;
    padding-right: 70px;
    /* padding-bottom: 10px; */
}

</style>

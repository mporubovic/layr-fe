<template>
    <div class="register">
        <div class="sign-up signinup-container-common"> 
            <div class="container-title">
                Tutor Sign Up
                
            </div>
            <hr class="horizontal-line">
            <div class="signinup-fields">
                <input @focus="onInputFocus($event)" id="signup-name-input" type="name" class="input-common" placeholder="Your Name">
                <input @focus="onInputFocus($event)" id="signup-email-input" type="email" class="input-common" placeholder="Your Email">
                <input @focus="onInputFocus($event)" id="signup-password-input" type="password" class="input-common" placeholder="Password (6+ characters)">
                <input @focus="onInputFocus($event)" id="signup-password-confirm-input" @keydown.enter="onRegisterEnter($event)" type="password" class="input-common" placeholder="Confirm Password">
            </div>

            <button class="buttons-common button-next" id="signup-button"
                            @click="submitRegistration"
                >
                <p>Sign up</p>
                <img src="@/assets/modal/login/next.svg" class="signinup-next-icon">
            </button>


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
            showEmailInput: true,
            showPasswordInput: false,
        }
    },

    // computed: {
    // },

    methods: {
        submitRegistration() {
            let email = this.$el.querySelector('#signup-email-input').value
            let password = this.$el.querySelector('#signup-password-input').value
            let confirmPassword = this.$el.querySelector('#signup-password-confirm-input').value
            let name = this.$el.querySelector('#signup-name-input').value
            
            if (!name) {
                this.$el.querySelector('#signup-name-input').classList.add('input-common-error')
                return
            }

            if (!email) {
                this.$el.querySelector('#signup-email-input').classList.add('input-common-error')
                return
            }

            if (!password) {
                this.$el.querySelector('#signup-password-input').classList.add('input-common-error')
                return
            }

            if (!confirmPassword) {
                this.$el.querySelector('#signup-password-confirm-input').classList.add('input-common-error')
                return
            }

            if (password !== confirmPassword) {
                this.$el.querySelector('#signup-password-confirm-input').classList.add('input-common-error')
                return
            }

            this.$el.querySelector('#signup-button').disabled = true

            let requestPayload = {
                email, password, name
            }

            this.$http.get('/auth/csrf-cookie').then((response) => {
                console.log("CSRF COOKIE", response)
                this.$http.post('/auth/register', requestPayload)
                    .then(response => {
                        console.log("API REGISTER RESPONSE", response.data )
                        this.$http.get('/api/user').then((response) => {
                            localStorage.setItem('userLoggedIn', true);
                            let user = response.data.user
                            this.$emit('loggedIn', user)
                        })
                    } )           
            })
        },
        
        onRegisterEnter(e) {
            e.target.blur()
            this.submitRegistration()
        },

        onInputFocus(e) {
            if (e.target.classList.contains('input-common-error')) e.target.classList.remove('input-common-error')

        }
    }
}
</script>
<style>
.register {
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
  .register {
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

.signinup-fields {
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

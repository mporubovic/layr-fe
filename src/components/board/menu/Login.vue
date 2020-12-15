<template>
    <div class="login">
        <div class="sign-in signinup-container-common">
            <div class="container-title">
                Sign In
            </div>
            <hr class="horizontal-line">
            
            <div class="signinup-fields">
                <input @focus="onInputFocus($event)" id="signin-email-input" type="email" class="signinup-email-input input-common" placeholder="Your Email">
                <input @focus="onInputFocus($event)" @keydown.enter="onLoginEnter($event)" id="signin-password-input" type="password" class="input-common signinup-password-input" placeholder="Your Password">

                        
            </div>
            <button class="button-next buttons-common"
                    @click="submitLogin"
                        >
                <p>Sign in</p>
                <img src="@/assets/modal/login/next.svg" class="signinup-next-icon">
            </button>

            <div class="forgot-password">
                <span class="link-common" @click="forgotPassword">Forgot your password?</span>
            </div>
   
        </div>

    </div>
</template>

<script>

export default {
    methods: {
        submitLogin() {
            let email = this.$el.querySelector('#signin-email-input').value
            let password = this.$el.querySelector('#signin-password-input').value

            if (!email) {
                this.$el.querySelector('#signin-email-input').classList.add('input-common-error')
                return
            }

            if (!password) {
                this.$el.querySelector('#signin-password-input').classList.add('input-common-error')
                return
            }

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
                            let user = response.data.user
                            this.$emit('loggedIn', user)
                        })
                    } ).catch(() => {
                            this.$el.querySelector('#signin-email-input').classList.add('input-common-error')
                            this.$el.querySelector('#signin-password-input').classList.add('input-common-error')
                        })     
            })
        },        
        
        onLoginEnter(e) {
            e.target.blur()
            this.submitLogin()

        },

        onInputFocus(e) {
            if (e.target.classList.contains('input-common-error')) e.target.classList.remove('input-common-error')

        },

        forgotPassword() {
            this.$emit('forgotPassword')
        }
    }
}
</script>
<style>
.login {
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
  .login {
    flex-direction: column;

  }

  .sign-in {
      margin-top: 20px;
      margin-left: 0px !important;
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
    padding-bottom: 5px;
    background-color: white;
    /* justify-content: center; */
    align-items: center;

}

.sign-in {
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

.forgot-password {
    margin-top: 10px;
    width: 100%;
    /* padding-left: 15px; */
    /* padding-bottom: 5px; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}


</style>

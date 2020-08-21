<template>
    <div id="app">
        <!-- <debug></debug> -->
        <div class="menu" id="menu">
            <div class="menu-content">

                <div class="menu-content-controls-primary">
                    <button class="menu-content-controls-primary-boards menu-content-buttons menu-content-buttons-primary">Boards</button>
                    <button class="menu-content-controls-primary-stacks menu-content-buttons menu-content-buttons-primary">Stacks</button>
                </div>
                

                <div class="menu-content-board-title">
                    <!-- <hr class="menu-content-line-left">     -->
                    <h1>My Board</h1>
                    <!-- <hr class="menu-content-line-right"> -->
                </div>
                <div class="menu-content-controls-secondary">
                    <button class="menu-content-controls-secondary-settings menu-content-buttons menu-content-buttons-secondary"
                                @click="settingsMenu"
                                >
                            Settings
                    </button>
                    <button class="menu-content-controls-secondary-help menu-content-buttons menu-content-buttons-secondary">Help</button>
                    <!-- <button class="menu-content-controls-secondary-share menu-content-buttons menu-content-buttons-secondary">Share</button> -->

                </div>
            </div>

            <div class="menu-pull" id="menu-pull"
                    @click="menuPullClick">
                <hr class="menu-pull-line">

            </div>
        </div>
        <div class="board" id="board">
            
            <stack/>


                <!-- <p>Stack bottom</p> -->

            <div class="cards" id="cards"></div>

        </div>
           
    </div>
</template>

<script>
import Stack from './components/Stack.vue'
import screenfull from 'screenfull'

export default {
    
    name: 'app',


    components: {
        Stack
    },

    data() {
        return {
            isMenuOpen: true,
            isFullscreen: false,
        }
    },

    methods: {
        menuPullClick() {
            // alert('click')
            if (this.isMenuOpen) {
                this.$nextTick(() => {
                    this.$el.querySelector('#menu').style.top = -50 + 'px'
                    this.$el.querySelector('#menu-pull').style["background-color"] = "rgba(0, 0, 0, 0.15)"
                    this.isMenuOpen = false
                })
            } else {
                this.$nextTick(() => {
                    this.$el.querySelector('#menu').style.top = 0
                    this.$el.querySelector('#menu-pull').style["background-color"] = "rgba(0, 0, 0, 0.45)"
                    this.isMenuOpen = true
                })
            }

        },

        settingsMenu() {
            // if (this.isFullscreen) {
            //     this.$nextTick(() => {
            //         this.$el.querySelector('#menu').style.height = 50 + 'px'
            //         this.isFullscreen = false
            //     })
            // } else {
            //     this.$nextTick(() => {
            //         this.$el.querySelector('#menu').style.height = 70 + 'px'
            //         this.isFullscreen = true

            //     })
            // }
            screenfull.toggle(); 
        }
    },


}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

*, html {
    margin: 0;
    padding: 0;
    outline: 0px solid red;
    border: 0;
    /* overflow:hidden; */
    /* appearance: none; */
    /* background: transparent; */
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.board {
    position: fixed;
    background-image: linear-gradient(to left bottom, #32bffd, #00aaff, #0092ff, #0076ff, #1653ff);
    height:100%;
    width:100%;
    overflow:hidden;
    z-index: 100;
}

.cards {
    height:100%;
    width:100%;
    overflow:hidden
}

.menu {
    height: 50px;
    position: fixed;
    /* margin-left: 10px;
    margin-right: 10px; */
    /* overflow:hidden; */

    width: 70%;
    margin-left: auto;
    margin-right: auto;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    border-bottom-left-radius: 10px;
    transition: top 0.4s,
                height 0.4s
                ;
    border-bottom-right-radius: 10px;
}

.menu-pull {
    width: 70px;
    height: 19px;
    position:absolute;
    /* right: 0px; */
    /* right: 45%; */
    right: 0;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    bottom: -19px;
    background-color: rgba(0, 0, 0, 0.50);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: background-color 0.4s;
    cursor: pointer;
    user-select: none;
}

.menu-pull-line {
    /* width: 20px; */
    width: 70%;
    position:relative;
    margin-left: auto;
    margin-right: auto;
    top:50%;
    border-top: 1px solid white;
}

.menu-content {
    flex: 1;
    /* background-color: yellow; */
    /* height: 50px; */
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    /* justify-content: flex-start; */
    /* justify-content: space-evenly; */
    /* justify-content: space-around; */
}

.menu-content-buttons {
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 16px;
    background-color: white;
    border-radius: 99px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 3px;
    padding-bottom: 3px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

.menu-content-buttons:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.menu-content-buttons-primary {
    margin-right: 15px;
}

.menu-content-buttons-secondary {
    margin-left: 15px;
}

.menu-content-controls-primary {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;
}

.menu-content-controls-secondary {
    margin-right: 20px;
}

.menu-content-board-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.menu-content-board-title h1 {
    color: white;
    font-size: 25px;
    user-select: none;
    /* text-decoration: underline; */
}

.menu-content-line-left {
    border-top: 1px solid white;
    /* margin-top: 5px; */
    /* width: 100%; */
    width: 50px;
    margin-right: 20px;

}

.menu-content-line-right {
    border-top: 1px solid white;
    /* margin-top: 5px; */
    /* width: 50%; */
    width: 50px;
    margin-left: 20px;
}

</style>
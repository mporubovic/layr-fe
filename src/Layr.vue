<template>
    <div id="app">
        <!-- <debug></debug> -->
        <div class="board" id="board">
            <!-- <stack @cardRemovedFromStack="stackRearrangeCards"> -->
            <stack>
            </stack>

                <!-- <p>Stack bottom</p> -->

            <div class="cards" id="cards"></div>

        </div>
           
    </div>
</template>

<script>
// import Debug from './components/Debug.vue'
import Stack from './components/Stack.vue'


export default {
    
    name: 'app',


    components: {
        // Debug,
        Stack
    },

    data() {
    
    }

}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    outline: 0px solid red;
    border: 0;
    appearance: none;
    background: transparent;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.board {
    position: fixed;
    background-image: linear-gradient(to left bottom, #32bffd, #00aaff, #0092ff, #0076ff, #1653ff);
    height:100%;
    width:100%;
    overflow:hidden
}

</style>
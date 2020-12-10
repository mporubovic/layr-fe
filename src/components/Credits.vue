<template>
    <div id="credits">
        <!-- <div id="title">
            Built with
        </div> -->
        <div id="container">
            <div class="credit" v-for="(c, i) in credits" :key="i">
                <img :src="c[0]" class="credit" v-if="c[1] !== -1" :style="{height: c[1] ? c[1] +'px' : null}">
                <p v-else>{{ c[0] }}</p>
                <!-- <img src="@/assets/credits/vuejs.png"> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            credits: [
                [require("@/assets/credits/vuejs.png")],
                [require("@/assets/credits/laravel.svg")],
                [require("@/assets/credits/fabricjs.png")],
                [require("@/assets/credits/tinymce.png"), 40],
                [require("@/assets/credits/interactjs.svg"), 25],
                [require("@/assets/credits/youtubevue.png")],
                ["screenful.js", -1],
            ]
        }
    },
}
</script>

<style scoped>

#title {
    color: white;
    font-size: 12px;
    font-style: italic;
    text-align: center;
}

#credits {
    /* height: 200px; */
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    padding-left: 10px;
    background-color: rgba(0, 0, 0, 0.55);
    position: fixed;
    bottom: 0;
    left: 0;
    /* height: 40px; */
    /* transform: translateX(-50%); */
    /* border-top-left-radius: 10px; */
    border-top-right-radius: 10px;
}

#container {
    display: flex;
    flex-direction: row;
}

.credit {
    height: 30px;
    margin-right: 5px;
    margin-left: 5px;
    display: flex;
    align-items: center;

}

.credit p {
    font-size: 15px;
    color: white;
    text-align: center;
    font-weight: 300;
}

</style>
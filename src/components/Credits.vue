<template>
    <div id="credits">
        <!-- <div id="title">
            Built with
        </div> -->
        <div id="container">
            <div class="credit" v-for="(c, i) in credits" :key="i">
                <img :src="c[0]" class="credit" v-if="c[0].substring(0,4) === 'http'" :style="{height: c[1] ? c[1] +'px' : null}">
                <p v-else>{{ c[0] }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            credits: [
                ["https://vuejs.org/images/logo.png"],
                ["https://laravel.com/img/logomark.min.svg"],
                ["https://pbs.twimg.com/profile_images/1436375272/Screen_shot_2011-07-11_at_1.55.36_AM_400x400.png"],
                ["https://avatars1.githubusercontent.com/u/119815", 40],
                ["https://interactjs.io/img/ijs.e9d09045.svg", 25],
                ["https://raw.githubusercontent.com/anteriovieira/vue-youtube/master/media/logo.png"],
                ["screenful.js"],
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
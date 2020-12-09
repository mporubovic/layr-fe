<template>
    <div id="ribbon">
        <div id="title">
            MyLayr {{ version }}
        </div>

        <div id="subtitle">

        </div>
    </div>
</template>

<script>
export default {
    computed: {
        version() {
            return process.env.VUE_APP_VERSION
        }
    }
}
</script>

<style scoped>


#ribbon {
    /* height: 200px; */
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    padding-left: 10px;
    background-color: rgba(0, 0, 0, 0.55);
    position: fixed;
    bottom: 0;
    right: 0;
    border-top-left-radius: 10px;
}

#title {
    color: white;
    font-size: 16px;
    /* font-style: bold; */
    text-align: center;
}

#container {
    display: flex;
    flex-direction: row;
}

</style>
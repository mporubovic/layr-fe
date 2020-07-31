<template>
    <div>
        <h2>Screen</h2>
            <ul>
                <li>Height: {{ screenHeight }}</li>
                <li>Width: {{ screenWidth }}</li>
            </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            screenHeight: 0,
            screenWidth: 0,

        }
    },

    mounted() {
        this.screenHeight = window.screen.height;
        this.screenWidth = window.screen.width;
    }
}
</script>
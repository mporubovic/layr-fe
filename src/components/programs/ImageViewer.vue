<template>
    <div class="gallery-container">
        <img :src="images[index]" />

        <div class="footer">
            
            <div class="footer-content">{{ imageName }}</div>

            <div class="footer-controls">
                <button
                    :disabled="content.length < 1 && index === 0"
                    @click="moveLeft"
                    class="button-move move-left"
                >←</button>

                <button
                    :disabled="content.length < 1 && index === content.length - 1"
                    @click="moveRight"
                    class="button-move move-right"
                >→</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            index: 0,
            images: [],
        };
    },

    computed: {
        imageName() {
            const splitName = this.content[this.index].file.name.split("/");
            return splitName[splitName.length - 1];
        },
    },

    methods: {
        moveRight() {
            if (this.index + 1 < this.content.length) {
                this.index++;
            }
        },

        moveLeft() {
            if (this.index - 1 > -1) {
                this.index--;
            }
        },
    },

    mounted() {
        this.content.forEach((element) => {
            let image = new Image();
            image.src = element.file.url
            this.images.push(image.src);
        });
    },
};
</script>

<style scoped>
.gallery-container,
img {
    width: 100%;
    height: 100%;
}

.gallery-container {
    position: relative;
    /* background-color: black; */
}

img {
    object-fit: contain;
    position: absolute;
}

.footer {
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px 15px 15px 15px;
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* align-items: center; */
    /* align-items: flex-start; */
    /* margin-bottom: 20px; */
    /* opacity: 0; */
    transition: opacity 0.2s ease-in-out;
}

.footer:hover {
    opacity: 1;
}

.button-move {
    font-family: monospace;
    font-size: 40px;
    background-color: transparent;
    /* color: light; */
    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
}

.button-move:not(:disabled):hover {
    color: lightskyblue;
}

.footer-content {
    /* flex: 0; */
    /* text-align: center; */
    font-size: 15px;
    background-color: rgba(255, 255, 255, 1);
    /* max-width: 40%; */
    /* width: auto; */
    height: 25px;
    max-height: 25px;
    /* min-width: 100px; */
    /* max-width: 100px; */
    padding: 5px 15px 5px 15px;
    border-radius: 99px;
    /* overflow-wrap: anywhere; */
    /* word-break: break-all; */
    /* overflow: hidden; */
    /* white-space: nowrap; */

    /* text-overflow: clip; */
    /* hyphens: auto; */

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: max-width 0.8s;
    margin-right: 25px;

}

.footer-content:hover {
    /* max-width: 80%; */
    /* flex:1; */
    /* min-width: unset !important; */
    /* max-width: 999px; */
}

.footer-controls {
    background-color: white;
    min-width: 100px;
    max-width: 100px;
    /* height: auto; */
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 99px;
    height: 35px;
}
</style>

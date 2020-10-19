<template>
    <div class="gallery-container">
        <img :src="images[index]" v-if="content.length > 0"/>
        <!-- <img :src="images[index]" /> -->

        <div class="footer" v-if="content.length > 0">
            
            <div class="footer-content">{{ imageName }}</div>

            <div class="footer-controls">
                        
                <div class="footer-controls-lr">
                    <button
                        :disabled="content.length < 1 && index === 0"
                        @click="moveLeft"
                        class="move-left footer-controls-common"
                        >
                            ←
                    </button>

                    <button
                        :disabled="content.length < 1 && index === content.length - 1"
                        @click="moveRight"
                        class="move-right footer-controls-common"
                        >
                            →
                    </button>
                </div>

                <div class="footer-controls-add">
                    <button
                        :disabled="content.length < 1 && index === 0"
                        @click="addImage()"
                        class="footer-controls-add-button footer-controls-common"
                        >
                            <img src="@/assets/common/add.svg">
                    </button>
                </div>
            </div>
        </div>

        <div class="image-selector" v-if="isFileSelectorOpen">
            <file-selector :sources="contentSources" @fileSubmitted="fileSelectorImageSubmitted">

            </file-selector>
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
            isFileSelectorOpen: false,
            contentSources: ['device']
        };
    },

    computed: {
        imageName() {
            if (this.content.length === 0) return
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
            if (this.index > 0) {
                this.index--;
            }
        },

        addImage() {
            this.isFileSelectorOpen = !this.isFileSelectorOpen;
        },

        fileSelectorImageSubmitted(files) {
            this.isFileSelectorOpen = false
            this.$emit('programCreatedContent', 'image-viewer', files)
        },

        createImage(source) {
            let image = new Image();
            image.src = source
            this.images.push(image.src);
        }
    },

    mounted() {
        if (this.content.length === 0) {
            this.isFileSelectorOpen = true
            return
        }
        this.content.forEach((element) => {
            this.createImage(element.file.url)
        });
    },

    watch: {
        content: {
            handler(n) {
                this.createImage(n[n.length-1].file.url)
                this.index = n.length-1
            } 

        },
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
    opacity: 0.35;
    transition: opacity 0.2s ease-in-out;
    overflow: hidden;
}

.footer:hover {
    opacity: 1;
}

.footer-controls {
        display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.footer-controls-common {
    font-family: monospace;
    font-size: 40px;
    background-color: transparent;
    /* color: light; */
    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
    transition: background-color 0.4s,
            box-shadow 0.1s;
    
}

.move-left:not(:disabled):hover, .move-right:not(:disabled):hover {
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
        box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);

}

.footer-content:hover {
    /* max-width: 80%; */
    /* flex:1; */
    /* min-width: unset !important; */
    /* max-width: 999px; */
}

.footer-controls-lr {
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
    margin-right: 10px;
        box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);

}

.footer-controls-add {

    height: 100%;
    
    
}

.footer-controls-add-button {
        box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0;
    padding-right: 0;
    height: 35px;
    min-width: 50px;
    max-width: 50px;
    border-radius: 99px;
    background-color: white;    
        box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
}

.footer-controls-add-button img {
    height: 20px;
    width: 20px;
}

.footer-controls-add-button:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.image-selector {
    box-sizing: border-box;
    overflow: hidden;
    padding: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

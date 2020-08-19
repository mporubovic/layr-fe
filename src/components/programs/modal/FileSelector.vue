<template>
    <div class="file-selector" 
            @drop.prevent="dropFiles($event)"
            @dragover="dragOver($event)">
        <div class="file-selector-header">
            <p>Content selector</p>
        </div>
        <hr class="file-selector-body-line">

        <div class="file-selector-body">
            <div class="file-selector-drag-n-drop">
                <button class="file-selector-button-common file-selector-button-drag-n-drop"
                        >
                    <img src="@/assets/modal/fileselector/drag.svg" class="file-selector-device-upload-icon">
                    <p class="file-selector-device-upload-text">Drag and drop content here</p>
                </button>
                
            </div>
            <div class="file-selector-device" v-if="localSources.device">
                <button class="file-selector-button-common file-selector-button-upload"
                        @click="openFileExplorer"
                        >
                    <img src="@/assets/modal/fileselector/file-upload.svg" class="file-selector-device-upload-icon">
                    <p class="file-selector-device-upload-text">Upload content from this device</p>
                    <input class="file-selector-device-upload-input" 
                            id="file-input" 
                            type="file" 
                            multiple 
                            ref="file" 
                            hidden
                            @change="filesFromExplorer($event)">
                </button>
                
            </div>

            <div class="file-selector-link file-selector-button-common" v-if="localSources.link">
                <div class="file-selector-link-div"
                        >
                    <img src="@/assets/modal/fileselector/link.svg" class="file-selector-link-icon">
                    <p class="file-selector-link-text">Link content from a URL</p>

                    

                </div>
                <div class="file-selector-link-input-div">
                    <input type="url" 
                            class="file-selector-link-input"
                            placeholder="Type in URL"
                            @mouseover="urlInputMouseOver($event)"
                            @mouseleave="urlInputMouseLeave($event)"
                            @blur="urlInputBlur($event)"
                            @keydown.enter="urlInputEnter($event)"
                            >
                </div>
            </div>

            
            
            
        </div>
        
        
    </div>
</template>

<script>
export default {

    props: {
        sources: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            d: null,
            localSources: {
                dragndrop: true,
                device: this.sources.includes('device') ? true : false,
                link: this.sources.includes('link') ? true : false,
            }
        }
    },

    methods: {
        dropFiles(event) {
            this.$refs.file.files = event.dataTransfer.files
            console.log(this.$refs.file.files)
        },
        
        dragOver(event) {
            event.preventDefault();
            
        },

        openFileExplorer() {
            // event.preventDefault();
            this.$el.querySelector('#file-input').click()
        },

        filesFromExplorer(event) {
            console.log(event.target.files)
        },

        urlInputMouseOver(event) {
            event.target.focus()
        },

        urlInputMouseLeave() {
            // event.target.blur()
        },

        urlInputBlur(event) {
            let val = event.target.value.trim()
            if (val) this.$emit('urlSubmitted', val)

        },

        urlInputEnter(event) {
            event.target.blur()
        }
    },
}
</script>

<style>

.file-selector {
    background: white;
    /* position: relative; */
    z-index: 99;
    max-height: 410px;
    min-height: 210px;
    max-width: 550px;
    min-width: 550px;
    border-radius: 15px;
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25);
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.file-selector-header {
    /* width: 100%; */
    display:flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 5px;
    /* margin-right: auto; */
}

.file-selector-header p {
    margin: 0;
    font-size: 30px;
    /* margin-right: auto; */
}

.file-selector-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    width: 90%;
}

.file-selector-device {
    /* display: flex; */
    /* flex-direction: row; */
    /* align-items: center; */
    /* box-sizing: content-box; */
    /* padding: 10px; */
    text-align: center;

}

.file-selector-button-common {
    /* border: 1px solid red; */
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* display: block; */
    width: 100%;
    /* justify-content: stretch; */
    /* flex: 1; */
    /* height: 120px; */
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
    /* box-sizing: border-box; */
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
        inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    transition: box-shadow 0.1s;
}

.file-selector-button-upload {
    cursor: pointer;
}

.file-selector-button-upload:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.file-selector-button-drag-n-drop:hover {
    box-shadow:
            0 0 0 2pt lightskyblue;
}

.file-selector-device-upload-text {
    font-weight: bold;
}

.file-selector-device-upload-icon {
    height: 40px;
    margin-bottom: 10px;
    margin-right: 15px;
}

.file-selector-device-upload-input{
    text-align: center;
    /* flex:1; */
    /* margin-left: 1000px; */
}

.file-selector-body-line {
    border-top: 1px solid black;
    margin-top: 5px;
    width: 100%;
}

.file-selector-link {
    background-color: white;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* display: block; */
    width: 90%;
    /* height: 100px; */
    /* justify-content: center; */
    /* flex: 1; */
    /* height: 120px; */
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
    /* box-sizing: border-box; */
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
        inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    transition: box-shadow 0.1s;
    /* cursor: pointer; */
}

.file-selector-link-div {
    /* background-color: white; */
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    

}

.file-selector-link-icon {
    height: 35px;
    margin-right: 15px;

}

.file-selector-link-text {
    font-weight: bold;
}

.file-selector-link-input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    flex: 1;
    background-color: lightgray;
    padding: 14px 18px;
    font-size: 20px;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 1px 1px 3px 0 rgba(255, 255, 255, 0.1);
    transition: padding 0.15s, box-shadow 0.15s;
    margin-top: 10px;
}

.file-selector-link-input:hover {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
            1px 1px 3px 0 rgba(255, 255, 255, 0.1),
            0 0 0 2px lightskyblue;
}

.file-selector-link-input:focus {
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.3),
            1px 1px 3px 0 rgba(255, 255, 255, 0.1),
            0 0 0 2px lightskyblue;
}


.file-selector-link-input-div {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
}

</style>
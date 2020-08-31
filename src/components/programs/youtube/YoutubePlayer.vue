
<template>
    <div class="youtube-video"
            :style="containerDynamicStyle"
            >

        <h2 v-if="contentLoading">Loading YouTube video...</h2>
        
        <div class="video-selector" v-show="showSelector">
            <file-selector :sources="contentSources"
                            
                            @urlSubmitted="fileSelectorUrlSubmitted">

            </file-selector>
        </div>        
        
        <div class="youtube-video-container"
                v-if="!showSelector && !contentLoading"
                >
            <youtube :video-id="videoId"
                    @ready="videoReady"
                    @ended="videoReady"
                    @buffering="videoBuffering"
                    @cued="videoCued"
                    @error="videoError"
                    @playing="videoPlaying"
                    @paused="videoPaused"
                    class="youtube-video-player"
                    ref="youtube"
                    frameborder="0"
                    >
            </youtube>
        </div>


        <!-- <div class="video-selector" v-show="content.length === 0"> -->

                


    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Array,
            required: true,
        },

        hasFocus: {
            type: Boolean,
            required: true,
        }
    },

    // components: {
    //   pdf
    // },

    data() {
        return {
            contentLoading: false,
            contentSources: ['link'],
        };
    },

    computed: {
        containerDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        },

        videoId() {
            return this.$youtube.getIdFromUrl(this.content[0].embed.path)
        },

        player() {
            return this.$refs.youtube.player
        },

        showSelector() {
            this.content
            return this.content.length === 0
        }
    },

    mounted() {
            
        if (this.content.length !== 0) {
            this.contentLoading = true        
            setTimeout(() => {
                this.contentLoading = false
            }, 500);
        }


            
    },

    methods: {
        videoReady() {
            console.log("VIDEO ", this.content[0].id, " ready")
        },

        videoPlaying() {
            console.log("VIDEO ", this.content[0].id, " playing")
            // this.player.pauseVideo()
            // setTimeout(() => {
            //     this.player.playVideo()
                
            // }, 3000);
        },
        
        videoEnded() {
            console.log("VIDEO ", this.content[0].id, " ended")
        },        
        
        videoBuffering() {
            console.log("VIDEO ", this.content[0].id, " buffering")
        },        
        
        videoCued() {
            console.log("VIDEO ", this.content[0].id, " cued")
        },        
        
        videoError() {
            console.log("VIDEO ", this.content[0].id, " error")
            this.$nextTick(() => {
                this.$emit('programDeletedContent', 'youtube-player', this.content[0])
            })
            
            // console.log(this.content.length)
        },
        
        videoPaused() {
            console.log("VIDEO ", this.content[0].id, " paused")
            this.player.getCurrentTime().then(time => console.log("PAUSED AT ", time))
        },

        fileSelectorUrlSubmitted(url) {
            // this.contentLoading = true
            // let updatedEmbed = JSON.parse ( JSON.stringify ( this.content) )

            this.$emit('programCreatedContent', 'youtube-player', url)
        }
    },
};
</script>

<style scoped>
.youtube-video {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    white-space:nowrap;
}

.youtube-video-container {
    overflow: hidden;
    height: 100%;


}
.youtube-video-player {
    width: 100%;
    height: 100%;
}

.youtube-video h2 {
    color:white;
}

/deep/ iframe {
    width: 100%;
    height: 100%;

}

.video-selector {
    box-sizing: border-box;
    overflow: hidden;
    padding: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
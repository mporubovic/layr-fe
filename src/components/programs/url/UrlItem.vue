                        v-if="urlTitleReuqestCompleted"
                                v-if="urlFaviconReuqestCompleted"

v-bind:href="content.url.path"

<template>

                <!-- <div class="url-list-item-inputs"> -->
                <div class="url-list-container" 
                        >
                    <!-- <input type="checkbox"> -->
                    <!-- <input name="Website" type="checkbox" value="Website" /> -->


                    <div class="url-list-item-favicon-wrapper">
                            <img class="url-list-item-favicon" 
                                    :src="content.url.ico"
                                    >
                    </div>
                    
                    
                    <input
                        @blur="onUrlInputBlur($event)"
                        @keydown.enter="onUrlInputKeydownEnter($event)"
                        class="url-list-item-input"
                        type="url"
                        v-bind:value="content.url.path"
                        id="url-input"
                        v-if="content.isEditing"
                        autocomplete="off" 
                        >

                    

                    <a class="url-list-item-href"
                        alt="Click to open"
                        target="_blank"
                        rel="noopener noreferrer"
                        v-bind:href="urlPathFormat"
                        v-if="!content.isEditing"
                        @contextmenu.prevent="hrefContextmenu()"
                        >
                        <!-- {{ url.url.path }} -->
                        {{ content.url.title }}
                        
                        </a>
                        
                </div>

                <!-- <span contenteditable="true" class="url-list-item-input">Type here...</span> -->
                <!-- <div class="url-list-item-controls">
                    <button
                        class="url-list-item-controls-common url-list-item-controls-edit"
                        @click="onUrlItemControlsEdit(url)"
                    >
                        ✏
                    </button>

                    <button
                        class="url-list-item-controls-common url-list-item-controls-delete"
                        @click="removeUrl(url)"
                    >
                        ✕
                    </button>
                </div> -->
            
</template>

<script>
export default {
    props: {
        content: {
            type: Object,
            required: true,
        },
        
        hasFocus: {
            type: Boolean,
            required: true,
        }
    },

    data() {
        return {
            urlInput: "New url",
            urlTitleReuqestCompleted: false,
            urlFaviconReuqestCompleted: false,
        };
    },

    computed: {
        urlListDynamicStyle() {
            return this.hasFocus ? {'pointer-events': ''} : {'pointer-events': 'none'}
        },

        urlFavicon() {
            return this.content.url.ico ?? null
        },

        urlTitle() {
            return this.content.title ?? null
        },

        urlPathFormat() {
            let path = this.content.url.path
            let urlFormatted = path

            if (path.search("http://") === -1 && path.search("https://") === -1) {
                urlFormatted = '//' + path
            }

            return urlFormatted

        }

    },

    
    // mounted() {

    // },
    
    created() {
        if (this.content.url.title === null) {
            this.fetchSiteTitle(this.content.url.path).then(response => {
                response ? this.content.url.title = response : this.content.url.title = this.content.url.path
            } )
            // response ? this.content.url.title = response : this.content.url.title = 'Unable to load title')
            this.fetchSiteFavicon(this.content.url.path).then(response => this.content.url.ico = response)
        }
        
    },
    
    methods: {

        fetchSiteFavicon: function(targetUrl) {
            let figApi = 'http://favicongrabber.com/api/grab/'
            targetUrl = targetUrl.split("//")[1] ? targetUrl.split("//")[1] : targetUrl
            targetUrl = targetUrl.split("/")[0] ? targetUrl.split("/")[0] : targetUrl

            // console.log(targetUrl)
            let faviconEndpoint = figApi + targetUrl
            // let ico = null

            return this.$http.get(faviconEndpoint)
                            .then(response => {
                                
                                // console.log(response.data)
                                let icons = response.data.icons
                                // console.log(icons[0].sizes)
                                // console.log(icons[0].sizes.split("x")[0])
                                this.icons = icons

                                let highestRes = Math.max.apply(
                                            Math,icons.map(
                                                function(i){
                                                    let s = i.sizes ? i.sizes.split("x")[0] : 0
                                                    return s;
                                                }
                                            )
                                        )

                                // console.log("H", highestRes)
                                
                                let icon = null


                                if (highestRes !== 0) {
                                    // let icon = icons.find(
                                    icon = icons.find(
                                        function(i) {
                                            let s = i.sizes ? i.sizes.split("x")[0] : 0
                                            // console.log("L", s)
                                         
                                            // return s === highestRes
                                            return s == highestRes
                                        }
                                    ).src

                                    // console.log(icon)
                                    
                                } else {
                                    icon = icons[0].src
                                    // console.log(icon)
                                }
                                
                                
                                return icon

                            }).catch(() =>  {
                                // console.log(error)
                                })
        },

        fetchSiteTitle: function(targetUrl) {
            let titleApi = 'http://textance.herokuapp.com/title/'
            targetUrl = targetUrl.split("//")[1] ? targetUrl.split("//")[1] : targetUrl

            let titleEndpoint = titleApi + targetUrl
            return this.$http.get(titleEndpoint)
                        .then(response => {
                            // console.log(response.data)
                            return response.data
                            
                        }).catch(()=>  {

                                })
        },
        
        updateUrlContent(url) {
            // url.isEditing = false
            // url.url.path = event.target.value
            console.log(url)
            // url.url.path = ( url.url.path.search("http://") || url.url.path.search("https://") ) ? '//' + url.url.path : url.url.path
            this.$emit('urlItemUpdated', url)
            this.content.url.title = "Loading..."
            this.fetchSiteTitle(url.url.path).then(response => response ? this.content.url.title = response : this.content.url.title = this.content.url.path)
            this.fetchSiteFavicon(url.url.path).then(response => { 
                                                                            response ? this.content.url.ico = response : this.content.url.ico = 'https://icons.iconarchive.com/icons/treetog/junior/128/earth-icon.png';
                                                                            
                                                                            this.content.isEditing = false})

        },

        onUrlInputBlur(event) {
            let updatedUrl = JSON.parse ( JSON.stringify ( this.content) )

            updatedUrl.url.path = event.target.value          
            
            this.updateUrlContent(updatedUrl)
            // this.$nextTick(() => {
                // this.content.isEditing = false
            // })
                
            // setTimeout(() => {
            //     this.content.isEditing = false
            //     console.log(this.content.isEditing)

            // }, 1000);

            // this.$emit('stopEditing', this.content.id)
            



        },

        onUrlInputChange(event) {
            let updatedUrl = JSON.parse ( JSON.stringify ( this.content) )

            updatedUrl.url.path = event.target.value
            
            this.updateUrlContent(updatedUrl)
        },
        
        onUrlInputKeydownEnter(event) {
            // let inputId = 'input-'+url.id
            // this.$refs[inputId][0].blur()
            event.target.blur()
        },

        hrefContextmenu() {
            if (!this.contextMenu) {
                this.content.isEditing = !this.content.isEditing

                this.$nextTick(() => {
                    this.$el.querySelector("#url-input").focus()
                })
            }
            
        },


        
        
        
    },

    // watch: {
    //     content: {
    //         deep: true,
            
    //         handler() {
    //             if (this.$el.getElementsByClassName(".url-list-item-input").activeElement) {
    //                 console.log("// ACTIVE")
    //             }
    //             console.log("// CONTENT", this.content.isEditing)
    //         }
            
    //     }
    // },
};
</script>

<style>
.url-list-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
    /* overflow-y: scroll; */
    overflow-y:auto;

}

.url-list-items {
    display: flex;
    flex-direction: column;
}

.url-list-item {
    display: flex;
    flex-direction: row;
    min-height: 60px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 5px;
    /* position: absolute; */


    width: 100%;
}

.url-list-item-inputs {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* width: 100%; */
    margin-left: 15px;
    margin-right: 25px;
    overflow: hidden;

    /* position: absolute; */

    /* height: 100%; */
    /* margin-right: 15px; */
    /* width: 100%; */
    /* max-width: 100%; */
}


.url-list-item-input {
    /* margin-left: 25px; */
    margin-right: 35px;

    /* width: auto; */
    /* margin-right: 15px; */
    font-size: 20px;
    width: 100%;
    /* padding-left: 10px; */
    box-sizing: border-box;
    border-bottom: 1px solid black;
    font-style: italic;

    /* max-width: auto; */

    /* max-width: 2000px;  */

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* margin-right: 25px; */
    transition: all 0.3s;
}

.url-list-item-favicon-wrapper {
    height: 50px;
    /* width: 50px; */
    min-width: 50px;
    margin-right: 25px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.url-list-item-favicon {
    max-height: 100%;
    /* width: 100%; */
    /* margin-left: auto;
    margin-right: auto; */
}

.url-list-item-favicon:before {
    content: 'NaN';
    font-size: 20px;
    display: block;
    height: 50px;
    width: 50px;
    margin-top: 5px;
    background-color: white;

}

.url-list-item-href {
    /* margin-left: 25px; */
    /* width: auto; */
    /* margin-right: 15px; */
    font-size: 20px;
    /* font-weight: bold; */

    /* width: 100%; */
    /* padding-left: 10px; */
    /* margin-right: 25px; */

    /* box-sizing: border-box; */
    /* border-bottom: 1px solid black; */
    /* max-width: auto; */

    /* max-width: 2000px;  */

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* margin-right: 25px; */
    transition: all 0.3s;
    /* text-decoration: none; */
    color: blue;
}

.url-list-item-href:hover {
    color: lightgreen;
}


.url-list-item-controls {
    display: flex;
    flex-direction: row;
    margin-right: 10px;
}

.url-list-item-controls-common {
    /* margin-left: 15px; */
    /* font-size: 20px;
    padding-left: 10px;
    padding-right: 10px; */
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 20px;
    background-color: white;
    border-radius: 99px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    margin-left: 15px;
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

.url-list-item-controls-common:hover {
    /* border: 1px lightgreen solid; */
    box-shadow: 0 0 0pt 2pt red;

}

.url-list-create-container {
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    /* width:280px; */
    /* height: 55px; */
    /* background-color: rgba(0, 0, 0, 0.2);
    border-radius: 99px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
    box-sizing: border-box; */
}

.url-list-create-common {
    text-decoration: none;
    user-select: none;
    color:black;
    font-size: 20px;
    background-color: white;
    border-radius: 99px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.4s,
                box-shadow 0.1s;
}

.url-list-create-common:hover {
    /* border: 1px lightgreen solid; */
    box-shadow: 0 0 0pt 2pt lightgreen;

}
</style>

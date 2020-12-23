<template>
    <div class="card-selector">
        <div id="add-content" v-if="!addButtonClicked">
            <button class="buttons-common add-button" @click="addButtonClicked = true">
                <img src="@/assets/common/addcircle.svg">
                Add content

            </button>
        </div>

        <div id="selector" v-if="addButtonClicked && !isCardSelected">
            <button class="card-button" 
                            v-for="newCard in newCards" 
                            :key="newCard.name"
                            @click="cardSelected(newCard)"
                            >
                    <div class="card-icon">
                        <img class="stack-new-card-menu-card-primary-icon" 
                            :src="newCard.icon">

                            <!-- {{ newCard.title }} -->

                    </div>

                    <div class="card-description">
                            {{ newCard.description }}
                    </div>
                
                </button>    
        </div>

            
    </div>
</template>

<script>
export default {
    props: {
        dimensions: {
            // type: Number,
        }
    },


    mounted() {

    },


    data() {
        return {

            addButtonClicked: false,
            isCardSelected: false,

            newCards: [              
                {
                    "type": "whiteboard",
                    "program": "whiteboard",
                    "title": "Draw",
                    "icon": require('@/assets/cards/icons/whiteboard.svg'),
                    "description": "Draw on a whiteboard",
                    "width": 2,
                    "height": 2,
                },                 
                {
                    "type": "pdf",
                    "program": "pdfviewer",
                    "title": "PDF",
                    "icon": require('@/assets/cards/icons/pdf.svg'),
                    "description": "Upload a PDF",
                    "width": 1,
                    "height": 2,
                },      
                {
                    "type": "youtube",
                    "program": "youtubeplayer",
                    "title": "Video",
                    "icon": require('@/assets/cards/icons/youtube.svg'),
                    "description": "Play a YouTube video",
                    "width": 2,
                    "height": 2,
                },                
                {
                    "type": "text",
                    "program": "texteditor",
                    "title": "Notes",
                    "icon": require('@/assets/cards/icons/text.svg'),
                    "description": "Write notes",
                    "width": 1,
                    "height": 2,
                },                
                {
                    "type": "url",
                    "program": "list",
                    "title": "URL",
                    "icon": require('@/assets/cards/icons/link.svg'),
                    "description": "Create a list of links",
                    "width": 2,
                    "height": 1,
                },                
                {
                    "type": "image",
                    "program": "gallery",
                    "title": "Image",
                    "icon": require('@/assets/cards/icons/image.svg'),
                    "description": "Upload images",
                    "width": 1,
                    "height": 1,
                },                  
                {
                    "type": "todo",
                    "program": "list",
                    "title": "Todo",
                    "icon": require('@/assets/cards/icons/todo.svg'),
                    "description": "Write a todo list",
                    "width": 2,
                    "height": 1,
                },  


            ],

        }
    },

    methods: {

        cardSelected(card) {
            this.isCardSelected = true
            this.$emit('cardSelected', card.type, this.dimensions)
        }
    },

};
</script>

<style scoped>

.card-selector {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0px 0px 0px 1.5px rgba(235, 235, 235, 0.2);


    /* overflow-y: scroll; */

}

#add-content {
    /* margin-left: auto; */

}

.add-button {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.add-button img {
    height: 30px;
    margin-right: 10px;
}

#selector {
    display: flex;
    flex-direction: column;
    /* align-items: left; */
    background-color: rgba(0, 0, 0, 0.30);
    /* border-radius: 10px 0px 0px 10px; */
    border-radius: 10px;
    transition: height 0.5s;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);

    -webkit-overflow-scrolling: touch;

    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px;
    max-height: 90%;
    /* overflow: scroll; */
    /* overflow: hidden; */
    overflow-x: hidden;

    overflow-y: scroll;

    /* height: 200px; */

}

.card-button {
    display: flex;
    /* min-height: 75px; */
    flex-direction: row;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
            inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
    margin-bottom: 15px;
    user-select: none;
    flex-wrap: nowrap;
    background-color: white;
    transition: box-shadow 0.1s,
                
                ;

    cursor: pointer;

}

.card-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin-right: 10px;
}

.card-icon img {
    height: 30px;
}

.card-description {
    flex: 9;
    font-size: 14px;
    /* font-weight: bold; */
    /* text-align: left; */
}

.card-button:hover:not([disabled]) {
    box-shadow: 0 0 0pt 2pt lightgreen;

}

/* #selector::-webkit-scrollbar {
    width: 7px;
}

#selector::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

#selector::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 99px;
}

#selector::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 5px white;

} */

</style>

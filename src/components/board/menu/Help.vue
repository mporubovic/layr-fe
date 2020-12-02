<template>
    <div id="help">
        <div class="tutorials containers-common">
            <div class="container-header">Tutorials</div>
                
            <hr class="line-common">

            <p class="container-text">
                To get started with using MyLayr, 
                watch these short tutorials 
                to find out about all the things you can do!
            </p>

            <div class="tutorial-list">
                <div class="tutorial" v-for="tutorial in tutorials" :key="tutorial.id">
                    <div class="tutorial-video">

                    </div>

                    <div class="item-title" :style="{borderColor: tutorial.color}">
                        {{ tutorial.title }}
                    </div>
                </div>
            </div>
                            
        </div>

        <div class="support containers-common">
            <div class="container-header">Support</div>

            <hr class="line-common">

            <p class="container-text">
                If something is not working right 
                or you need help with anything 
                please reach out to us via email at 
                <a href="mailto:support@mylayr.com" class="link-mail">
                    support@mylayr.com</a>
                <br>
                We aim to respond within 24 hours.
            </p>
                            
        </div>

        <div class="feedback containers-common">
            <div class="container-header">Feedback</div>

            <hr class="line-common">

            <p class="container-text">
                We are constanly putting out new features.<br>
                If you have a suggestion for a feature 
                you would like to see, please let us know at 
                <a href="mailto:feedback@mylayr.com" class="link-mail">
                    feedback@mylayr.com</a>

                — it might end up being implemented!

            </p>
                            
        </div>
                
    </div>
</template>

<script>

// import { loremIpsum } from "lorem-ipsum";

export default {
    // name: 'menu-stacks'
    props: {
        user: {
            type: Object
        }
    },

    data() {
        return {
            tutorials: [
                {
                    id: 0,
                    title: "Tutor quickstart",
                    showTo: 'tutor',
                    url: 'vimeo',
                    color: 'lightgreen'
                },

                {
                    id: 1,
                    title: "Student quickstart",
                    showTo: 'student',
                    url: 'vimeo',
                    color: '#04C8FB'
                }
            ]
        }
    },

    computed: {
        userRole() {
            return this.user.role
        },
        

    },

    created() {
    },

    methods: {

    }
}
</script>
<style scoped>
#help {

}

.tutorial-list {
    padding: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.tutorial {
    /* width: 200px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 30px;
}

.tutorial-video {
    width: 200px;
    height: 100px;
    background-color: white;
    border-radius: 3px;
}

.support, .feedback {
    margin-top: 40px;
}





</style>

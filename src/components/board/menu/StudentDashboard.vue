<template>
    <div id="dashboard">
        <div class="stacks-list-container containers-common">
            <div class="stacks-container-header">
                <h1 class="stacks-container-title"> Your stacks </h1>
                
            </div>
            <hr class="line-common">

            <p class="container-text container-text-white" v-if="sortedStacks && sortedStacks.length === 0">Your tutor has not created any stacks for you yet — check back later.</p>
            
            <div class="stacks-list-carousel-container" v-if="sortedStacks && sortedStacks.length > 0">

                <menu-stacks @subMenuStackClicked="selectStack" 
                                :createStack='false' 
                                :stacks="sortedStacks"
                                >
                                
                </menu-stacks>
                            
            </div>
                
        </div>

    </div>
</template>

<script>

// import { loremIpsum } from "lorem-ipsum";

export default {
    // name: 'menu-stacks'
    props: {
        // students: {
        //     // type: [Object, Null],
        //     required: true,
        // }
        // stacks,

        user: {
            type: Object
        }
    },

    data() {
        return {
            stacks: null,
            students: [],
            // students: null,
            selectedStudentId: null,
            studentNameEditingId: null,
            isNewStudentFormVisible: false,
            newStudentInvited: false,
        }
    },

    computed: {
        selectedStudent() {
            return this.students.find(s => s.id === this.selectedStudentId)
        },
        
        stackContainerTitle() {
            return this.selectedStudent ? this.selectedStudent.name + '\'s stacks' : 'Select a student on the left'  
        },

        sortedStacks() {
            return this.stacks ? this.stacks.filter(b=>b).sort(function(a, b) {
                                        let ta = new Date(a.info.created_at)
                                        let tb = new Date(b.info.created_at)
                                        return tb.getTime() - ta.getTime()
                                    }) : undefined
            // return this.stacks
        },


    },

    created() {
        // this.stacks = this.generateStacks(15)
        this.loadStacks()
    },

    methods: {
        loadStacks() {
            this.$http.get('/api/stacks').then((response) => {
                console.log('API STACKS RESPONSE DATA', response.data)
                this.stacks = response.data.stacks
            })
        },

        selectStack(id) {
            this.$emit('subMenuStackClicked', id)
        },


    }
}
</script>
<style>
#dashboard {

}


</style>

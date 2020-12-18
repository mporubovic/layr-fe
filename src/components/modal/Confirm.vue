<template>
    <div id="modal-confirm" class="containers-common">
        <div id="challenge">
            <slot></slot>
        </div>

        <div id="selection">
            <button class="buttons-common cancel" @click="$emit('selectionCanceled')">
                Cancel
            </button>

            <button class="buttons-common buttons-common-red confirm" @click="$emit('selectionConfirmed')">
                {{ confirmText }}
            </button>
        </div>
        
    </div>
</template>

<script>
export default {
    props: {
        confirmText: {
            type: String
        }
    },

    data() {
        return {
            
        }
    },

    computed: {
        
    },
    
    mounted() {
        
    },

    methods: {
        
    },
    

};
</script>

<style>

#modal-confirm {
    position: fixed;
    top: 0;
    right: 0;
    /* background-color: red; */
    /* width: 100px; */
    /* height: 100px; */
    /* transform: translate(-50%, 0); */
    padding: 10px;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    user-select: none;

}

.cancel, .confirm {
    margin-left: 10px;
    margin-right: 10px;
}


#selection {
    display: flex;
    flex-direction: row;

}

#challenge {
    color: white;
    text-align: center;
    margin-bottom: 10px;
    /* font-weight: bold; */
}

</style>

<template>
    <div id="layout-selector" class="containers-common containers-center">
        <div id="title" class="container-header container-header-center">
            Select a layout
        </div>


        <div id="templates">
            <div class="template" @click="templateSelected(template)" v-for="(template, i) in templates" :key="i" :style="{opacity: template.disabled ? 0.5 : 1, cursor: template.disabled ? 'not-allowed' : 'pointer'}">
                <div class="template-icons">
                    <div class="template-icon" v-for="(icon, i) in template.icons" :key="i" :style="{gridArea: icon}"></div>
                </div>

                <div class="template-name" v-html="template.name">
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    mounted() {


    },

    data() {
        return {
            templates: [
                {
                    name: 'Fullscreen',
                    icons: [
                        '1/1/2/2',
                    ]
                },
                {
                    name: 'Split screen',
                    icons: [
                        '1/1/2/2',
                        '1/2/2/3',
                    ]
                },
                {
                    name: '3 divisions',
                    icons: [
                        '1/1/3/2',
                        
                        '1/2/2/3',
                        '2/2/3/3',
                    ]
                },
                {
                    name: '4 divisions',
                    icons: [
                        '1/1/2/2',
                        '2/1/3/2',
                        '1/2/1/3',
                        '2/2/2/3',
                    ]
                },
                {
                    name: '<i>Custom (coming soon)',
                    icons: [
                        '1/4/5/5',
                        '1/1/3/4',
                        '3/1/5/2',
                        '3/2/5/4',
                    ],
                    disabled: true,
                },
            ]
        }

    },

    computed: {
        

    },

    methods: {
        templateSelected(template) {
            if (!template.disabled) this.$emit('templateSelected', template.icons)
        }
    },

};
</script>

<style>

#templates {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;

}

.template {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
    margin-right: 15px;
    cursor: pointer;
}

.template-icons {
    display: grid;
    /* height: 100%; */
    gap: 5px;
    /* width: 100%; */
    width: 192px;
    height: 108px;
}

.template-icon {
    background-color: rgba(255, 255, 255, 0.3);
    border: 5px white solid;
    box-sizing: border-box;
    border-radius: 8px;
    box-shadow: inset 0 0 2px 0 black;
}

.template-name {
    margin-top: 10px;
    color: white;
    user-select: none;
}


</style>

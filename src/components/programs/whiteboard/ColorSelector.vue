<template>
    <div class="color-selector">
        <button class="color-button-black color-button-common" @click="colorSelected('blackColor')" :ref="'blackColor'" title="Black"/>

        <button class="color-button-blue color-button-common" @click="colorSelected('blueColor')" :ref="'blueColor'" title="Blue"/>

        <button class="color-button-red color-button-common" @click="colorSelected('redColor')" :ref="'redColor'" title="Red"/>

        <button class="color-button-green color-button-common" @click="colorSelected('greenColor')" :ref="'greenColor'" title="Green"/>

        <button class="color-button-yellow color-button-common" @click="colorSelected('yellowColor')" :ref="'yellowColor'" title="Yellow"/>

        <button class="color-button-orange color-button-common" @click="colorSelected('orangeColor')" :ref="'orangeColor'" title="Orange"/>
        
        <button class="color-button-white color-button-common" @click="colorSelected('whiteColor')" :ref="'whiteColor'" title="White"/>
        
        <button v-if="transparentColor" class="color-button-transparent color-button-common" @click="colorSelected('transparentColor')" :ref="'transparentColor'" title="Transparent"/>

    </div>
</template>

<script>
export default {
    props: {
        globalColor: {
            type: String,
        },

        localColor: {
            type: String
        },

        transparentColor: {
            type: Boolean,
            default: false,
        }
    },
    
    data() {
        return {
            selectedColor: null,
        }
    },

    mounted() {
        if (this.globalColor) this.setColor(this.globalColor)
        if (this.localColor) this.setColor(this.localColor)
    },

    methods: {
        colorSelected(color) {
            this.$emit('colorSelected', color)
        },

        setColor(color) {
            if (this.selectedColor) {
                this.$refs[this.selectedColor].style['opacity'] = 0.3
                this.$refs[this.selectedColor].style['width'] = '30px'
            } 

            this.selectedColor = color

            this.$nextTick(()=>{
                this.$refs[color].style['opacity'] = 1
                this.$refs[color].style['width'] = '45px'
            })
        }
    },

    watch: {
        globalColor: {
            handler(n) {
                this.setColor(n)
            }
            
        },

        localColor: {
            handler(n) {
                if (n !== undefined) this.setColor(n)
            }
            
        }
    },

};
</script>

<style>
.color-selector {
    display: flex;
    flex-direction: row;
    /* justify-content: center; */
    align-items: center;
    /* padding-left: 10px; */
    height: 100%;
}


.color-button-common {
    width: 30px;
    height: 20px;
    border-radius: 6px;    
    margin-left: 2px;
    margin-right: 2px;
    opacity: 0.3;
    cursor: pointer;
    transition: opacity 0.15s,
                width 0.3s
                
                ;

}

.color-button-common:hover {
    opacity: 1 !important;
}

.color-button-blue {
    background-color:rgb(0, 100, 255);
}

.color-button-red {
    background-color: red;
}

.color-button-green {
    background-color: lightgreen;
}

.color-button-yellow {
    background-color: yellow;
}

.color-button-black {
    background-color: black;
}
.color-button-orange {
    background-color: orange;
}
.color-button-white {
    background-color: white;
}
.color-button-transparent {
    /* background-color: white; */
background: repeating-linear-gradient(
  -45deg,
  #ffffff 1px,
  #ffffff 5px,
  #ff0000 7px,
  #ff0000 10px
);

}

</style>
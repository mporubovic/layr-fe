<template>
    <div id="demo" class="containers-common container-center container-white">
        <!-- <div class="demo-link link-common">Try out a demo</div> -->
        <div class="container-title">
            Try out a demo
        </div>
        <hr class="horizontal-line">
        <div class="container-text container-text-black" style="text-align: center">
            A full featured demo
        </div>
        <div class="demo-sub-container container-padding-full">
            <button class="button-next buttons-common"
                    @click="demoButtonClick"
                        >
                <p>Try now</p>
                <img src="@/assets/modal/login/next.svg" class="signinup-next-icon">
            </button>
        </div>

    </div>
</template>

<script>
export default {
    methods: {
        demoButtonClick() {
            location.href = '/demo'
        }
    },
};
</script>

<style>

#demo {
    margin-top: 20px;
}

</style>

<template>
    <div>
        <h2>Counter value: {{ counter }}</h2>

        <button @click="incrementCounter">Add 1 to counter</button>
    </div>
</template>

<script>
export default {
    data() {
        return { counter: 0 }
    },

    methods: {
        incrementCounter() {
            this.counter++;
        }
    }
}
</script>
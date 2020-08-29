<template>
    <div>
        <h1>Boards</h1>
        <ul v-for="board in boards" :key="board.attributes.id">
            <li> {{ board.attributes.title }}</li>
            <ul>
                <li>ID: {{ board.attributes.id }}</li>
                <li>Last update: {{ board.attributes.updated_at }}</li>
                <li>Created at {{ board.attributes.created_at }}</li>
            </ul>
        </ul>

    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Authorization'] = 'Bearer 1|0PEeQDfqCbM6W0HEFvX1WlqA2xuQ0mQ1ABWf5S5r2z9TbWNwM1Jgykz5XJeahWBHQvwAwKBTdPfCM0tS';
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    
    data() {
        return {
            boards: []
            }
    },

    mounted() {
        // this.boards = axios.request('http://localhost:8000/api/boards')
        //                     .then(response => console.log(response));
        this.boards = axios({
            method: 'get',
            url: '/api/boards'
        }).then(response => this.boards = response.data.boards)
    }

}
</script>
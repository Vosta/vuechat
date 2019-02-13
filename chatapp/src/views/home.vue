<template>

    <div>
        <p>Welcome to the app</p>
        <v-btn color="primary" @click="logout()">Log out</v-btn>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            
        }
    },
    methods: {
        ...mapActions(['logout'])
    },
}
</script>


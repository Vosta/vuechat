<template>
    <v-layout>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-list-tile-avatar class="profilePicture">
          <img :src="avatar">
        </v-list-tile-avatar>

        <v-toolbar-title class="profileUsername">{{name}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="logout()">
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
    </v-layout>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    props: ['name', 'avatar']
}
</script>
<template>
  <v-layout>
    <v-flex>
      <v-toolbar class="chatToolbar" flat>
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
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["name", "avatar"]
};
</script>

<style scoped>
.chatToolbar {
  border-bottom: 1px solid lightgray;
}
</style>

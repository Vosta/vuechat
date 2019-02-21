<template>
  <div>
    <v-layout>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-list-tile-avatar class="profilePicture">
          <img :src="user.currentUser.avatar">
        </v-list-tile-avatar>

        <v-toolbar-title class="profileUsername">{{user.currentUser.username}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="logout()">
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
    </v-layout>

    <v-layout class="tabsLayout">
      <chat-navigation class="chatNavigation"></chat-navigation>
    </v-layout>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import chatNavigation from './chatNavigation.vue'
export default {
  components: {
    chatNavigation
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["logout"])
  },
};
</script>

<style scoped>
.profilePicture {
  margin-left: 20px;
}
.profileUsername {
  margin-left: 0;
}
.search {
  align-self: center;
}
.tabsLayout {
  width: 100%;
  height: 100%;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.chatNavigation{
  width: 100%;
}
.tabs {
  width: 100%;
}
</style>


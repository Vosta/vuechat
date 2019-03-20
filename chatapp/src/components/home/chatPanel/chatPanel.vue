<template>
  <div>
    <v-layout column class="chatPanelLayout">
      <v-flex class="chatPanelRow">
        <v-toolbar class="panelToolbar" flat>
          <v-list-tile-avatar class="profilePicture">
            <img :src="user.avatar">
          </v-list-tile-avatar>

          <v-toolbar-title class="profileUsername">{{user.username}}</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn icon @click="currentTab = 'chat-list'">
            <v-icon>home</v-icon>
          </v-btn>

          <v-btn icon @click="currentTab = 'search-users'">
            <v-icon>person_add</v-icon>
          </v-btn>

          <v-btn icon @click="currentTab = 'contact-list' ">
            <v-icon>chat</v-icon>
          </v-btn>

          <v-menu :nudge-width="120" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile @click="logout()">
                <v-list-tile-title>Edit Profile</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout()">
                <v-list-tile-title>Log Out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-flex>
      <div class="underToolbar">
        <v-flex v-if="notification" class="chatPanelRow">
          <v-alert :value="true" :type="notification.type">{{ notification.msg }}</v-alert>
        </v-flex>

        <v-flex>
          <component :is="currentTab" class="componentTab"></component>
        </v-flex>
      </div>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import searchUsers from "./searchUsers.vue";
import chatList from "./chatList.vue";
import contactList from "./contactList.vue";
export default {
  components: {
    chatList,
    contactList,
    searchUsers
  },
  data() {
    return {
      contactsDialog: false,
      addUserDialog: false,
      currentTab: "chat-list"
    };
  },
  watch: {
    notification() {
      setInterval(() => {
        this.SET_notification();
      }, 2500);
    }
  },
  computed: {
    ...mapGetters(["user", "notification"])
  },
  methods: {
    ...mapActions(["logout", "showContacts"]),
    ...mapMutations([
      "SET_ActiveUsers",
      "SET_ActiveContacts",
      "SET_notification"
    ])
  }
};
</script>

<style scoped>
.underToolbar {
  border: 1px solid lightgray;
  border-top: 0;
  height: 100%;
  background-color: white;
}
.panelToolbar {
  border: 1px solid lightgray;
}
.chatPanelLayout {
  height: 100%;
}
.chatPanelRow {
  max-height: max-content;
}
.componentTab {
  height: 100%;
}
.profileUsername {
  margin-left: 0;
}
.search {
  align-self: center;
}
.tabsLayout {
  width: 100%;
  height: 95%;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.chatNavigation {
  width: 100%;
}
.chatList {
  width: 100%;
  height: 100%;
}
.tabs {
  width: 100%;
}
</style>


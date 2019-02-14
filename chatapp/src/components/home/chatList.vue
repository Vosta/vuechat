<template>
  <div>
    <v-layout>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-list-tile-avatar class="profilePicture">
          <img :src="user.avatar">
        </v-list-tile-avatar>

        <v-toolbar-title class="profileUsername">{{user.username}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
    </v-layout>
    <v-layout>
      <v-card style="width: 100%;border-radius: 0px">
        <v-text-field
          hide-details
          append-icon="mic"
          class="search mx-3"
          flat
          label="Search"
          prepend-inner-icon="search"
          solo-inverted
        ></v-text-field>
      </v-card>
    </v-layout>

    <v-layout class="tabslayout">
      <v-tabs style="width:100%" slot="extension" v-model="tabs" fixed-tabs>
        <v-tab :key="1">Contacts</v-tab>
        <v-tab :key="2">Chats</v-tab>
        <v-tab :key="3">Status</v-tab>
        <v-tabs-items v-model="tabs">

          <v-tab-item :key="1">
            <v-list-tile
            v-for="contact in contacts"
            :key="contact.username"
            avatar
          >
            <v-list-tile-avatar>
              <img :src="user.avatar">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="contact.username"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon teal>chat_bubble</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-tab-item>
        <v-tab-item :key="2">
            <v-list-tile
            v-for="chat in chats"
            :key="chat.room"
            avatar
          >
            <v-list-tile-avatar>
              <img :src="user.avatar">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="chat.room"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon grey>chat_bubble</v-icon>
            </v-list-tile-action>
          </v-list-tile> 

          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      user: {
        avatar: "https://www.bzl.co/avatar/T-pikachu-1481600098.03.jpg",
        username: "Vosta"
      },
      text: "asd",
      tabs: null
    };
  },
  computed: {
          ...mapGetters(["contacts","chats"])
  },
  methods: {
    ...mapActions(["logout","requestContacts"])
  },
  created() {
      this.requestContacts();
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
.tabslayout {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.tabs {
  width: 100%;
}
</style>


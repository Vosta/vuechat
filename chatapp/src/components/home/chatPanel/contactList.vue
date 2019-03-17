<template>
  <div>
    <v-text-field
      flat
      class="searchBar"
      label="Search"
      prepend-inner-icon="search"
      hide-details
      single-line
      solo
    ></v-text-field>
    <v-list subheader class="contactList">
      <v-list-tile avatar class="contact" @click="addGroupChat()">
        <v-list-tile-avatar>
          <v-icon class="avatarGroup">group_add</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>New group chat</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-subheader>Contacts</v-subheader>
      <v-list-tile
        v-for="contact in user.contactsData"
        @click="handleOpenChat(contact)"
        avatar
        class="contact"
        :key="contact.username"
      >
        <v-list-tile-avatar class="avatarImage">
          <img :src="contact.avatar">
        </v-list-tile-avatar>

        <span class="bubble" :class="{ bubbleActive: contact.active }"></span>

        <v-list-tile-content>
          <v-list-tile-title v-html="contact.username"></v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action class="iconDiv">
          <v-icon teal class="icon chat">chat</v-icon>
        </v-list-tile-action>
        <v-list-tile-action class="iconDiv">
          <v-icon teal @click.stop="removeContact(contact)" class="icon delete">delete</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "currentChat"])
  },
  methods: {
    ...mapActions(["addContact", "removeContact", "openChat"]),
    handleOpenChat(contact) {
      if (contact.username !== this.currentChat.name) {
        const data = {
          direct: true,
          chatData: {
            name: contact.username,
            avatar: contact.avatar,
            contactId: contact._id
          }
        };
        this.openChat(data);
      }
    }
  }
};
</script>
<style scoped>
.contactList {
  padding: 0;
  height: 100%;
}
.contact:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.avatarGroup {
  font-size: 30px;
  background-color: burlywood;
  border-radius: 50%;
}
.iconDiv {
  justify-content: center;
  min-width: 30px;
}
.icon {
  margin-right: 10px;
  font-size: 28px;
}
.bubble {
  border-radius: 100%;
  width: 15px;
  height: 15px;
  position: relative;
  left: -30px;
  bottom: -15px;
  background-color: grey;
}
.bubbleActive {
  background-color: green;
}
.chat {
  color: green;
}
.notActive {
  color: grey;
}
.delete {
  color: rgb(107, 20, 20);
}
</style>



<template>
  <div>
    <v-list subheader v-if="user.contactRequests.length > 0">
      <v-subheader>Contact Requests</v-subheader>
      <v-list-tile
        v-for="contact in user.contactRequests"
        avatar
        class="contact"
        :key="contact.username"
      >
        <v-list-tile-avatar class="avatarImage">
          <img :src="contact.avatar">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title v-html="contact.username"></v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <span><v-icon teal class="icon" @click="addContact({contactId: contact._id, fromRequest: true})">add_circle</v-icon></span>
        </v-list-tile-action>
        <v-list-tile-action class="iconDiv">
          <v-icon teal @click.stop="removeContactRequest(contact)" class="icon delete">delete</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>

    <v-list subheader>
      <v-subheader>Contacts</v-subheader>
      <v-list-tile
        v-for="contact in user.contacts"
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
    ...mapGetters(["user", "chatName"])
  },
  methods: {
    ...mapActions(["addContact", "removeContact", "openChat"]),
    handleOpenChat(contact) {
      console.log(contact);
      if (contact.username !== this.chatName) {
        const data = {
          direct: true,
          name: contact.username,
          avatar: contact.avatar,
          contact
        };
        this.openChat(data);
      }
    }
  }
};
</script>
<style scoped>
.contact:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
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



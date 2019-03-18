<template>
  <div>
    <div>
      <v-list v-if="user.contactRequests.length > 0" subheader class="contactRequestsList">
        <v-subheader>Contact requests</v-subheader>
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
            <span>
              <v-icon @click="acceptContact(contact._id)" teal>add_circle</v-icon>
            </span>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list v-if="user.contactPendings.length > 0" subheader>
        <v-subheader>Pending requests</v-subheader>
        <v-list-tile
          v-for="contact in user.contactPendings"
          class="searchUser"
          avatar
          :key="contact.username + 2"
        >
          <v-list-tile-avatar>
            <img :src="contact.avatar">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="contact.username"></v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action class="iconDiv">
            <v-icon teal @click="removePendingRequest(contact._id)" class="icon delete">delete</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  props: ["user"],
  methods: {
    ...mapActions(["addContact"]),
    acceptContact(contactId){
      this.$socket.emit('ACCEPT_CONTACT_REQUEST', contactId)
    },
    removePendingRequest(contactId){
      this.$socket.emit('REMOVE_PENDING_REQUEST', contactId);
    }
  }
};
</script>

<style scoped>
</style>

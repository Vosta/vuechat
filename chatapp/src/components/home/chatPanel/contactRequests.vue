<template>
  <v-list v-if="user.contactRequests.length > 0" subheader class="contactRequestsList">
    <v-subheader>Contact requests</v-subheader>
    <v-list-tile
      v-for="contact in user.contactRequests"
      @click="addContact({contactId: contact._id, fromRequest: true})"
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
          <v-icon teal>add_circle</v-icon>
        </span>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
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
  }
};
</script>

<style scoped>
</style>

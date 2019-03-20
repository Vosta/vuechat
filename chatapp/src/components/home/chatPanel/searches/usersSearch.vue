<template>
  <div>
    <div v-if="search.value.length > 0">
      <v-list subheader v-if="search.data.length > 0">
        <v-subheader>Found Users</v-subheader>
        <v-list-tile
          v-for="user in search.data"
          @click="sendContactRequest(user._id)"
          class="searchUser"
          avatar
          :key="user.username"
        >
          <v-list-tile-avatar>
            <img :src="user.avatar">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="user.username"></v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <span>
              <v-icon teal>add_circle</v-icon>
            </span>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <div v-else>
        <p class="noTextFound">No users found</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "search"])
  },
  methods: {
    ...mapMutations(["SET_SEARCH_STATUS", "SET_SEARCH_VALUE"]),
    sendContactRequest(contactId){
      this.$socket.emit('CONTACT_REQUEST', contactId);
      this.SET_SEARCH_VALUE();
      this.SET_SEARCH_STATUS(false);
    }
  }
};
</script>
<style scoped>
.searchUser:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.18);
}
.noTextFound {
  padding-top: 49%;
  width: max-content;
  margin: auto;
  color: #999;
}
</style>


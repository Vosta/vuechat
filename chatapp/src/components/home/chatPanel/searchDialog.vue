<template>
  <div>
    <div v-if="search.data.length > 0">
      <v-list-tile
        v-for="user in search.data"
        @click="addContact({contactId: user._id, fromRequest: false})"
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
    </div>
    <div v-else>
      <p class="noTextFound">No users found</p>
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
    ...mapGetters(["search"])
  },
  methods: {
    ...mapActions(["addContact"]),
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


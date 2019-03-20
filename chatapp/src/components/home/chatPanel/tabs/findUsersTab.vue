<template>
  <div>
    <v-layout column>
      <v-flex>
        <v-text-field
        class="searchBar"
          flat
          hide-details
          label="Search users"
          prepend-inner-icon="search"
          single-line
          solo
          :value="search.value"
          @keyup="updateSearch"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <search-dialog v-if="search.status"></search-dialog>
        <contact-requests v-else :user="user"></contact-requests>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import usersSearch from "../searches/usersSearch.vue";
import contactRequests from "../tabs/contactRequests.vue";
export default {
  components: {
    searchDialog: usersSearch,
    contactRequests
  },
  computed: {
    ...mapGetters(["user", "search"])
  },
  methods: {
    ...mapActions(["requestContacts", "searchData"]),
    ...mapMutations(["SET_SEARCH_STATUS", "SET_SEARCH_VALUE"]),
    updateSearch(e) {
      const searchValue = e.target.value;
      this.SET_SEARCH_VALUE(searchValue);
      if (searchValue !== "") {
        const data = {
          currentUser: this.user,
          value: searchValue,
          type: 'users'
        }
        this.$socket.emit('SEARCH', data); 
      } else {
        this.SET_SEARCH_STATUS(false);
      }
    }
  },
  created() {
    //get suggested contacts
  }
};
</script>
<style>
.searchBar {
  border-radius: 30%;
}
.unreadBubble {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: rgb(247, 198, 92);
  text-align: center;
}
.tabText {
  margin-bottom: 0;
  margin-right: 10px;
}
</style>

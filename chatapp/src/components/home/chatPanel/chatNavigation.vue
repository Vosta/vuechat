<template>
  <div>
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
            :value="searchValue"
            @keyup="updateSearch"
          ></v-text-field>
        </v-card>
      </v-layout>
      <search-dialog v-if="searchStatus" :searchVal="searchValue"></search-dialog>
      <v-flex v-else class="tabslayout">
        <v-tabs style="width:100%" slot="extension" v-model="tablele" grow>
          <v-tab>Contacts</v-tab>
          <v-tab>Chats</v-tab>
          <v-tab>Status</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tablele" >
          <v-tab-item >
            <contact-list :contacts="user.contacts"></contact-list>
          </v-tab-item>
          <v-tab-item>
            <chat-list :chats="user.chats"></chat-list>
          </v-tab-item>
          <v-tab-item>
            <status-list></status-list>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </div>

</template>

<<script>
    import { mapGetters, mapActions, mapMutations } from "vuex";
    import chatList from './chatList.vue';
    import contactList from './contactList.vue';
    import statusList from './statusList.vue';
    import searchDialog from './searchDialog.vue';
    export default {
        components: {
            chatList, contactList, statusList, searchDialog
        },
        data() {
            return {
                tablele: null,
            }
        },
        computed: {
            ...mapGetters(["user", "searchStatus", "searchValue"])
        },
        methods: {
            ...mapActions(["requestContacts", "searchData"]),
            ...mapMutations(["SET_searchStatus", "SET_searchValue"]),
            updateSearch(e){
              let searchValue = e.target.value;
              this.SET_searchValue(searchValue);
              if(searchValue !== ''){
                let searchData = {
                  username: this.user.currentUser.username,
                  value: searchValue
                }
                this.searchData(searchData);
              } else {
                this.SET_searchStatus(false);
              }
            }
        },
        created() {
            this.requestContacts();
        },
    }
</script>
<style>

</style>

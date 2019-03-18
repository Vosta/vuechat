<template>
  <v-layout class="mainView container">
    <v-flex class="chatPanelFlex">
      <chat-panel class="chatComponent"></chat-panel>
    </v-flex>
    <v-flex class="chatViewFlex">
      <chat-view v-if="currentChat.status" class="chatComponent"></chat-view>
      <div v-else>
        <p
          style="width: max-content; margin: auto; margin-top: 50%"
        >Welcome to the chat. Have fun :D</p>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import chatPanel from "../components/home/chatPanel/chatPanel.vue";
import chatView from "../components/home/chatView/chatView.vue";
export default {
  components: {
    chatPanel,
    chatView
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "currentChat", "loggedIn", "authToken"])
  },
  methods: {
    ...mapActions(["getContact"]),
    ...mapMutations(["SET_user", "SET_contactStatus", "SET_DefaultState"])
  },
  sockets: {
    connect(){
      console.log('connected');
      
    }
  },
  mounted() {
    
    /*this.$socket.on("ActiveUsers", data => {
      console.log(data);
      this.SET_user(data);
    });
    this.$socket.on("contactStatusChanged", contact => {
      this.SET_contactStatus(contact);
    });
    this.$socket.on("contactRequest", contactId => {
      if (this.user.currentUser.contactRequests.indexOf(contactId) < 0 && this.user.currentUser.contacts.indexOf(contactId) < 0) {
        console.log(this.user)
        console.log(this.user.currentUser.contacts);
        console.log(this.user.currentUser.contacts.indexOf(contactId))
        this.getContact(contactId);
      }
    });*/
  },
  mounted(){
    this.$socket.emit('GET_USER_DATA', this.authToken);
  }
};
</script>
<style>
.searchBar {
  border-bottom: 1px solid darkgray;
  border-radius: 20%;
}
</style>
<style scoped>
.mainView {
  display: inline-flex;
  width: 1300px;
}
.chatPanelFlex {
  width: 30%;
}
.chatViewFlex {
  width: 70%;
  border: 1px solid lightgray;
  border-left: 0;
}
.chatComponent {
  height: 100%;
}
</style>



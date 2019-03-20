<template>
  <v-layout class="container mainView">
    <v-flex class="chatPanelFlex">
      <chat-panel class="chatComponent"></chat-panel>
    </v-flex>
    <v-flex class="chatViewFlex">
      <chat-view v-if="currentChat.status" class="chatComponent"></chat-view>
      <div class="welcomeDiv" v-else>
        <img class="chatImage" src="../assets/logo.png">
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
    connect() {
      console.log("connected");
    }
  },
  mounted() {
    this.$socket.emit("GET_USER_DATA", this.authToken);
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
.welcomeDiv{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatImage{
  opacity: 0.7;
}
.mainView {
  padding-top: 0;
  padding-bottom: 0;
  display: inline-flex;
  width: 1300px;
  height: 100%;
}
.chatPanelFlex {
  width: 30%;
}
.chatViewFlex {
  width: 70%;
  border-right: 5px solid lightgray;
  border-left: 0;
}
.chatComponent {
  height: 100%;
}
</style>



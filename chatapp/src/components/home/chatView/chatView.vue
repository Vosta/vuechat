<template>
  <v-layout column class="viewLayout">
    <v-flex>
      <chat-toolbar :name="currentChat.toolbar.name" :avatar="currentChat.toolbar.avatar"></chat-toolbar>
    </v-flex>
    <v-flex class="chatWrapper">
      <div v-if="currentChat.status" ref="chatDisplayId">
        <div v-for="(message, index) in currentChat.messages" :key="index">
          <div v-if="message.info" class="divrow">
            <v-flex class="infoMessageWrapper">
              <p :class="{infoMessage: message.info}">{{ message.content }}</p>
            </v-flex>
          </div>
          <div v-else>
            <v-flex class="from-contact" :class="messageByWho(message.by)">
              <p class="chatMessage">{{ message.content }}</p>
            </v-flex>
          </div>
        </div>
      </div>
    </v-flex>
    <v-flex>
      <chat-keyboard class="chatKeyboard"></chat-keyboard>
    </v-flex>
  </v-layout>
</template>

<script>
import chatToolbar from "./chatToolbar.vue";
import chatKeyboard from "./chatKeyboard.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  components: {
    chatToolbar,
    chatKeyboard
  },
  data() {
    return {
      typing: {
        status: false,
        message: ""
      },
      notification: ""
    };
  },
  computed: {
    ...mapGetters(["currentChat", "user"])
  },
  methods: {
    ...mapActions(["logout", "sendMessage"]),
    ...mapMutations(["SET_Message"]),

    messageByWho(userId) {
      console.log(userId, this.user._id)
      if (userId === this.user._id) {
        return "from-user";
      }
      return "from-contact";
    }
  },
  mounted() {
    /*this.$socket.on("recieveMessage", data => {
      this.SET_Message(data);
    });
    this.$socket.on("userEnteredOrLeft", message => {
      const userJoinedMessage = {
        content: message,
        info: true
      };
      this.SET_Message({ message: userJoinedMessage });
    });*/
  },
  updated() {
    this.$refs.chatDisplayId.scrollTop = this.$refs.chatDisplayId.scrollHeight;
  }
};
</script>
<style scoped>
.viewLayout {
  background: antiquewhite;
}
.chatKeyboard {
  width: 70%;
  margin: auto;
  margin-bottom: 6px;
}
.chatWrapper {
  height: 90%;
}
.chatDisplay {
  height: 90%;
  width: 100%;
  max-height: 800px;
  overflow: auto;
  position: relative;
  padding-top: 20px;
}
.from-contact {
  margin-top: 20px;
  margin-left: 70px;
  max-width: 35%;
  min-height: 70px;
  height: max-content;
  background-color: #87b7e6;
  border-radius: 55px;
}
.from-user {
  max-width: 35%;
  min-height: 70px;
  height: max-content;
  background-color: rgb(112, 199, 112);
  border-radius: 55px;
  margin-left: 60%;
}
.chatMessage {
  word-wrap: break-word;
  font-size: 22px;
  margin-top: 10px;
  padding: 10px 35px 10px 35px;
}
.infoMessage {
  width: max-content;
  margin: auto;
  margin-top: 10px;
  font-size: 15px;
  color: #2196f3;
  padding: 0;
}
.divrow {
  width: 100%;
  height: 70px;
  min-height: max-content;
}
</style>

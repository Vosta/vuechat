<template>
  <div>
    <chat-toolbar :name="chatName" :avatar="chatAvatar" class="chatToolbar"></chat-toolbar>
    <div class="chatWrapper" >
      <div v-if="chatStatus" class="chatDisplay" ref="chatDisplayId">
        <div class="divrow" v-for="(message, index) in chatMessages" :key="index">
          <v-flex v-if="message.content" class="from-contact" :class="messageByWho(message.by)">
            <p class="chatMessage">{{ message.content }}</p>
          </v-flex>
        </div>
      </div>
      <chat-keyboard class="chatKeyboard"></chat-keyboard>
    </div>
  </div>
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
        message: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      "dialogStatus",
      "chatStatus",
      "chatName",
      "chatAvatar",
      "chatMessages",
      "chatId",
      "user"
    ])
  },
  methods: {
    ...mapActions(["logout", "sendMessage"]),
    ...mapMutations(["SET_Message"]),
    
    messageByWho(userId) {
      if (userId === this.user.currentUser._id) {
        return "from-user";
      }
      return "from-contact";
    }
  },
  mounted() {
    this.$socket.on("messageSent", data => {
      this.SET_Message(data.message);
    });
  },
  updated() {
    this.$refs.chatDisplayId.scrollTop = this.$refs.chatDisplayId.scrollHeight;
  },
};
</script>
<style scoped>
.chatToolbar {
  background-color: red;
}
.chatKeyboard {
  position: absolute;
  width: 70%;
  left: 50%;
  transform: translate(-50%)
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
.divrow {
  width: 100%;
  height: 70px;
  min-height: max-content;
}
</style>

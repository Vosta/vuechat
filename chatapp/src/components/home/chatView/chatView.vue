<template>
  <div>
    <chat-toolbar :name="chatName" :avatar="chatAvatar" class="chatToolbar"></chat-toolbar>
    <div v-if="chatStatus" class="chatDisplay">
      <div class="divrow" v-for="(message, index) in chatMessages" :key="index">
        <v-flex v-if="message.content" class="from-contact">
          <p class="chatMessage">{{ message.content }}</p>
        </v-flex>
      </div>
    </div>
    <chat-keyboard class="chatKeyboard"></chat-keyboard>
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
  computed: {
    ...mapGetters([
      "dialogStatus",
      "chatStatus",
      "chatName",
      "chatAvatar",
      "chatMessages"
    ])
  },
  methods: {
    ...mapActions(["logout", "sendMessage"]),
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    messageSent: function(val) {
      console.log("asd");
      this.ADD_Message(val);
    }
  },
  mounted() {
    this.$socket.on("messageSent", data => {
      this.sendMessage(data);
    });
    
  }
};
</script>
<style scoped>
.chatToolbar {
  background-color: red;
}
.chatKeyboard {
  margin: auto;
  width: 70%;
  position: relative;
  bottom: 0;
}
.chatDisplay {
  height: 85%;
  width: 100%;
  position: relative;
  padding-top: 20px
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
  position: absolute;
  right: 70px;
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
}
</style>

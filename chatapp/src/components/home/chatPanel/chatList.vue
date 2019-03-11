<template>
  <div>
    <div v-for="chat in user.chats" :key="chat.name">
      <v-list-tile avatar class="chatRow" @click="handleOpenChat(chat)">
        <v-list-tile-avatar>
          <img :src="chat.avatar">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <div class="contentListRow">
            <v-list-tile-title>{{ chat.name }}</v-list-tile-title>
            <span class="bubble unreadBubble">{{ 7 }}</span>
          </div>
        </v-list-tile-content>

        <v-list-tile-action class="iconDiv">
          <v-icon teal class="icon chat">chat</v-icon>
        </v-list-tile-action>
        <v-list-tile-action class="iconDiv">
          <v-icon teal @click.stop="removeChat(chat._id)" class="icon delete">delete</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user", "chatId"])
  },
  methods: {
    ...mapActions(["openChat"]),
    handleOpenChat(chat) {
      if (chat._id != this.chatId) {
        const data = {
          direct: false,
          ...chat
        }
        this.openChat(data);
      }
    }
  }
};
</script>
<style scoped>
.chatRow:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.iconDiv {
  justify-content: center;
  min-width: 30px;
}
.icon {
  margin-right: 10px;
  font-size: 28px;
}
.iconDiv {
  justify-content: center;
  min-width: 30px;
}
.chat {
  color: green;
}
.notActive {
  color: grey;
}
.delete {
  color: rgb(107, 20, 20);
}
.unreadBubble {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: rgb(247, 198, 92);
  text-align: center;
}
.contentListRow {
  display: flex;
}
</style>

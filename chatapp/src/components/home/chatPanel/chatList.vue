<template>
  <div>
    <v-text-field class="searchBar" flat label="Search" prepend-inner-icon="search" hide-details single-line solo></v-text-field>
    <v-list v-if="user.chats.length > 0" subheader class="chatList">
      <v-subheader>Chats</v-subheader>
      <v-list-tile
        v-for="chat in user.chats"
        :key="chat.name"
        avatar
        class="chatRow"
        @click="handleOpenChat(chat)"
      >
        <v-list-tile-avatar>
          <img :src="chat.avatar">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <div class="contentListRow">
            <v-list-tile-title>{{ chat.name }}</v-list-tile-title>
          </div>
        </v-list-tile-content>

        <v-list-tile-action class="iconDiv">
          <v-icon teal class="icon chat">chat</v-icon>
        </v-list-tile-action>
        <v-list-tile-action class="iconDiv">
          <v-icon teal @click.stop="removeChat(chat._id)" class="icon delete">delete</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <div v-else>
      <p
        style="margin:auto; max-width: max-content"
      >Navigate to the add chat or add user button to add a chat</p>
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
    ...mapGetters(["user", "currentChat"])
  },
  methods: {
    ...mapActions(["openChat", "removeChat"]),
    handleOpenChat(chat) {
      if (chat._id != this.currentChat.id) {
        const data = {
          direct: false,
          chatData: {
            ...chat
          }
        };
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
.chatRow {
  width: 100%;
}
.chatList {
  padding: 0;
  height: 100%;
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

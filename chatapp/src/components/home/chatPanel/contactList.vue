<template>
  <div>
    <v-list-tile v-for="contact in user.contacts" avatar class="contact" :key="contact.username">
      <v-list-tile-avatar class="avatarImage">
        <img :src="contact.avatar">
      </v-list-tile-avatar>
      <v-list-tile-action class="avatarImage">
        <span class="bubble" :class="{ bubbleActive: contact.active }"></span>
      </v-list-tile-action>
      <v-list-tile-content style="margin-left: 10px">
        <v-list-tile-title v-html="contact.username"></v-list-tile-title>
      </v-list-tile-content>

      <v-list-tile-action class="iconDiv">
        <v-icon
          teal
          @click="openChat({id: contact._id, avatar: contact.avatar, name: contact.username})"
          class="icon chat"
        >chat</v-icon>
      </v-list-tile-action>
      <v-list-tile-action class="iconDiv">
        <v-icon teal @click="removeContact(contact._id)" class="icon delete">delete</v-icon>
      </v-list-tile-action>
    </v-list-tile>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["removeContact", "openChat"]),
  },
};
</script>
<style scoped>
.contact:hover {
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
.avatarImage{}
.bubble{
  border-radius: 100%;
  width: 15px;
  height: 15px;
  position: relative;
  left: -30px;
  bottom: -15px;
  background-color: grey;
}
.bubbleActive{
  background-color: green;
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
</style>



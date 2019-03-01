<template>
  <div>
    <v-list-tile v-for="contact in contacts" avatar class="contact" :key="contact.username">
      <v-badge :color="getActiveColor(contact._id)" bottom overlap class="activeBadge">
        <template v-slot:badge>
          <v-icon class="activeIcon">blank</v-icon>
        </template>
        <v-avatar class="avatarImage">
          <img :src="contact.avatar">
        </v-avatar>
      </v-badge>

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
    ...mapGetters(["activeUsers"]),
  },
  props: ["contacts"],
  methods: {
    ...mapActions(["removeContact", "openChat"]),
    getActiveColor(contactId){
      console.log(contactId)
      if(this.activeUsers[contactId]){
        return 'green'
      }
      return 'grey'
    }
  }
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
.activeBadge{
  padding-right: 7px;
}
.chat {
  color: green;
}
.notActive{
  color: grey
}
.delete {
  color: rgb(107, 20, 20);
}
</style>



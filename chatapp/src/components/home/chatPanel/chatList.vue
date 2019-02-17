<template>
  <div>
    <v-list-tile avatar v-for="chat in chats" :key="chat.name">
      <v-list-tile-avatar>
        <img :src="chat.avatar">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title v-html="chat.name"></v-list-tile-title>
      </v-list-tile-content>

      <v-list-tile-action>
        <v-icon teal>chat_bubble</v-icon>
      </v-list-tile-action>
    </v-list-tile>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  props: ["chats"]
};
</script>
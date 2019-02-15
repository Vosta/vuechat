<template>
  <div>
    <v-list-tile avatar>
      <v-list-tile-avatar>
        <img :src="user.avatar">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>Status 007</v-list-tile-title>
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
      user: {
        avatar: "https://www.bzl.co/avatar/T-pikachu-1481600098.03.jpg",
        username: "Vosta"
      }
    };
  },
};
</script>
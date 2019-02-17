<template>
  <div>
    <v-list-tile avatar v-for="contact in contacts" :key="contact.username">
      <v-list-tile-avatar>
        <img :src="contact.avatar">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title v-html="contact.username"></v-list-tile-title>
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
  props: ["contacts"]
};
</script>


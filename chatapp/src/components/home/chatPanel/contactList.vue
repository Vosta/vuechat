<template>
  <div>
    <v-list-tile avatar class="contact" v-for="contact in contacts" :key="contact.username">
      <v-list-tile-avatar>
        <img :src="contact.avatar">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title v-html="contact.username"></v-list-tile-title>
      </v-list-tile-content>

      <v-list-tile-action class="iconDiv">
        <v-icon teal class="icon chat">chat</v-icon>
      </v-list-tile-action>
      <v-list-tile-action class="iconDiv">
        <v-icon teal class="icon delete">delete</v-icon>
      </v-list-tile-action>
    </v-list-tile>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["contacts"]
};
</script>
<style scoped>
.contact:hover{
  background-color: rgba(0, 0, 0, 0.10);
  cursor: pointer;
}
.iconDiv{
  justify-content: center;
  min-width: 30px;
}
.icon{
  margin-right: 10px;
  font-size: 28px;
}
.chat{
  color: green
}
.delete{
  color: rgb(107, 20, 20);
}
</style>



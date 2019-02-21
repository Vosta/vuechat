<template>
<v-container grid-list-md>
<v-layout row wrap>
    <v-flex class="xs-2" v-for="avatar in avatars" :key="avatar">
      <v-avatar @click="setAvatar(avatar)" class="avatarImage" size=100>
        <img :src="avatar">
      </v-avatar>
    </v-flex>
  </v-layout>
</v-container>
  
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["avatars"])
  },
  methods: {
    ...mapMutations(["SET_currentAvatar", "SET_avatarDialog"]),
    ...mapActions(["getAvatars"]),
    setAvatar(avatarImage){
        this.SET_currentAvatar(avatarImage);
        this.SET_avatarDialog(false);
    }
  },
  created() {
    this.getAvatars();
  }
};
</script>

<style>
</style>

<template>
  <div class="contatiner">
      <chat-list style="width:40%"></chat-list>
    <div>
      <v-btn color="primary" @click="logout()">Log out</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import chatList from '../components/home/chatList.vue'
export default {
  components: {
      chatList
  },  
  data() {
    return {};
  },
  methods: {
    ...mapActions(["logout"])
  },
  
};
</script>


<template>
  <div class="mainView container">
    <chat-panel class="chatPanel"></chat-panel>
    <chat-view v-if="chatStatus" class="chatView"></chat-view>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import chatPanel from "../components/home/chatPanel/chatPanel.vue";
import chatView from "../components/home/chatView/chatView.vue";
export default {
  components: {
    chatPanel,
    chatView
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["chatStatus", "loggedIn"])
  },
  methods: {
    ...mapMutations(["SET_user", "SET_contactStatus", "SET_DefaultState"])
  },
  mounted() {
    this.$socket.on('ActiveUsers', data => {
      console.log(data)
      this.SET_user(data)
    });
    this.$socket.on('contactStatusChanged', contact => {
      this.SET_contactStatus(contact);
    });
  },
};
</script>
<style scoped>
.mainView {
  display: inline-flex;
}
.chatPanel {
  width: 30%;
  height: 100%;
}
.chatView {
  width: 70%;
  height: 100%;
  position: relative;
}
</style>



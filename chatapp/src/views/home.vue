<template>
  <div class="mainView container">
    <chat-panel class="chatPanel"></chat-panel>
    <chat-view v-if="chatStatus" class="chatView"></chat-view>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
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
    ...mapMutations(["SET_ActiveUsers"])
  },
  mounted() {
    if (this.loggedIn) {
      this.$socket.on("activeUser", data => {
        console.log('hello')
        console.log(data);
        this.SET_ActiveUsers(data);
      });
    }
  }
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



<template>
  <div class="mainView container">
      <chat-panel class="chatPanel"></chat-panel>
      <chat-view class="chatView"></chat-view>
  </div>
</template>

<script>
import chatPanel from '../components/home/chatPanel/chatPanel.vue';
import chatView from '../components/home/chatView/chatView.vue'
export default {
  components: {
      chatPanel,
      chatView
  },  
  data() {
    return {};
  },
};
</script>
<style scoped>
.mainView{
  display: inline-flex;
}
.chatPanel {
  width: 30%;
  height: 100%
}
.chatView{
  width: 70%
}
</style>



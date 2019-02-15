<template>
  <div class="contatiner">
      <chat-panel class="chatPanel"></chat-panel>
  </div>
</template>

<script>
import chatPanel from '../components/home/chatPanel.vue'
export default {
  components: {
      chatPanel
  },  
  data() {
    return {};
  },
};
</script>
<style scoped>
.chatPanel {
  width: 30%;
  height: 100%
}
</style>



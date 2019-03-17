<template>
  <v-form>
          <v-text-field
            class="messageField"
            v-model="message"
            append-outer-icon="send"
            background-color = "white"
            box
            clear-icon="close"
            clearable
            label="Message"
            type="text"
            @click:append-outer="setMessage"
            @click:clear="clearMessage"
            @keypress.enter.prevent="setMessage"
            hide-details
          ></v-text-field>
  </v-form>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    show: false,
    message: "",
    typing: false,
    timeout: null
  }),
  watch: {},
  computed: {
    ...mapGetters(["user", "currentChat"])
  },

  methods: {
    setMessage() {
      if (this.message !== "") {
        let messageData = {
          chatId: this.currentChat.id,
          message: {
            content: this.message,
            by: this.user._id,
            date: Date.now()
          }
        };
        this.$socket.emit("SEND_MESSAGE", messageData);
        this.clearMessage();
      }
    },

    clearMessage() {
      this.message = "";
    }
  }
};
</script>
<style scoped>

</style>


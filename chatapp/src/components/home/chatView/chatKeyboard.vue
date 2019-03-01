<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex>
          <v-text-field
            class="messageField"
            v-model="message"
            append-outer-icon="send"
            box
            clear-icon="close"
            clearable
            label="Message"
            type="text"
            @click:append-outer="setMessage"
            @keypress.enter.prevent="setMessage"
            hide-details
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
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
    ...mapGetters(["user", "chatId"])
  },

  methods: {
    ...mapActions(["sendMessage"]),

    setMessage() {
      if (this.message !== "") {
        let messageData = {
          chatId: this.chatId,
          message: {
            content: this.message,
            by: this.user.currentUser._id,
            date: Date.now()
          }
        };
        this.$socket.emit("message", messageData);
        this.sendMessage(messageData);
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


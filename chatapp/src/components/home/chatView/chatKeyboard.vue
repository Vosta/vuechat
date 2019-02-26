<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex>
          <v-text-field
            v-model="message"
            append-outer-icon="send"
            box
            clear-icon="close"
            clearable
            label="Message"
            type="text"
            @click:append-outer="sendMessage"
            @keypress.enter.prevent="sendMessage"
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
    marker: true
  }),

  computed: {
    ...mapGetters(["user"])
  },

  methods: {
    ...mapActions(["sendMessageData"]),
    toggleMarker() {
      this.marker = !this.marker;
    },
    async sendMessage() {
      let messageData = {
        content: this.message,
        by: this.user.currentUser._id,
        date: Date.now()
      };
      let response = await this.$socket.emit("message", messageData);
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    }
  }
};
</script>

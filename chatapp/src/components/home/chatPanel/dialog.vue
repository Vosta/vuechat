<template>
  <div class="container">
    <v-flex text-xs-center class="mainLayout" row>
      <v-avatar align-center class="avatar" size="200">
          <img class="avatarImage" :src="avatar">
      </v-avatar>
    </v-flex>
    <v-flex>
        <v-form class="authform">
                    <v-text-field
                      prepend-icon="chat"
                      name="newChatName"
                      v-model="chat.name"
                      label="Chat name"
                      type="text"
                    ></v-text-field>
        </v-form>
        <v-select>
            <p v-for= "item in users" :key="item">{{item}}</p>
        </v-select>
    </v-flex>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatar:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/f19a8dbd-b9e4-4ce8-9726-5a1412453ce7/dabhcbd-a0cbee93-78f5-4333-82b8-84fc8eca21bb.png",
        chat:{
            name: ''
        }
    };
  }
};
</script>

<style scoped>
.avatar{
    margin-top: 40px;
    width: 100%;
    height: 400px;
}
.avatarImage{
    border: 1px solid black
}
</style>

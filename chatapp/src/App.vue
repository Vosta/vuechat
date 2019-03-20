<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  }
};
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  
}
#app {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
  height: 100%;
  background-image: url('./assets/background.jpg');
}
.contatiner {
  margin-left: 10%;
  margin-right: 10%;
  height: 100%;
}
</style>




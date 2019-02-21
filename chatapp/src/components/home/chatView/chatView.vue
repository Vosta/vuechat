<template>
  <div>
    
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
    
  computed: {
    ...mapGetters(["dialogStatus"])
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>


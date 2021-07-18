<template>
  <div class="user-msg" :class="(userMsg.type)">
    <p>{{ userMsg.txt }}</p>
    <span v-if="userMsg.type === 'success'" class="material-icons-outlined">check</span>
    <span v-if="userMsg.type === 'error'" class="material-icons-outlined">close</span>
  </div>
</template>

<script>
export default {
  computed: {
     isOn(){
        return { 'is-on':(this.userMsg.txt)}
     },
     msgType(){
        return { 'is-on':(this.userMsg.txt)};
     },
    userMsg() {
     return this.$store.getters.userMsg;
    },
  },
};
</script>

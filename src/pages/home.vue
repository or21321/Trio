<template>
  <div class="home">
    <h1>Trio</h1>
    <button class="start-btn" @click="signupAndStart">Get Started</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  created() { 
  },
  methods: {
    async signupAndStart(){
      await this.$store.dispatch({ type: "signupAsGuest" });
      this.$router.push('/b/b101')
    }
  }
}
</script>
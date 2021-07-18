<template>
  <div class="homepage">
    <h1>
      <span class="material-icons-outlined logo-icon">space_dashboard</span>Trio
    </h1>
    <button class="start-btn" @click="signupAndStart">Get Started</button>
    <nav class="homepage-nav">
      <!-- <button>Log in</button>
      <button>Sign in</button> -->
      <router-link to='/login' class="login">Log in</router-link>
      <router-link to='/signup' class="signup">Sign up</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  created() {},
  methods: {
    async signupAndStart() {
      await this.$store.dispatch({ type: "signupAsGuest" });
      
      this.$router.push(`/b/${this.$store.getters.boards[0]._id}`);
    },
  },
};
</script>
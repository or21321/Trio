<template>
  <div class="homepage">
     <section class="header">
      <div class="logo">
         <span class="material-icons-outlined logo-icon">space_dashboard</span>Trio
      </div>
      <button class="start-btn" @click="signupAndStart">Get Started</button>
      <nav class="homepage-nav">
         <router-link to='/login' class="login">Log in</router-link>
         <router-link to='/signup' class="signup">Sign up</router-link>
      </nav>
    </section>

    <img class="hero" src="@/assets/hero.svg" alt="">

    <img class="wave wave1" src="@/assets/waves/wave1.svg" alt="">
    <img class="wave wave2" src="@/assets/waves/wave2.svg" alt="">
    <img class="wave wave3" src="@/assets/waves/wave3.svg" alt="">
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
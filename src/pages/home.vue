<template>
  <div class="homepage">
    <img class="wave" src="@/assets/wave.svg" alt="">
     <section class="header-waves">
      <div class="logo">
         <span class="material-icons-outlined logo-icon">space_dashboard</span>Trio
      </div>
      <nav class="homepage-nav">
         <router-link to='/login' class="login">Log in</router-link>
         <span> | </span>
         <router-link to='/signup' class="signup">Sign up</router-link>
      </nav>
    </section>
    <div class="layout">
    <main class="main-home-page">
    <section class="started">
       <p class="txt-title"> Manage your projects with your team/friends easily and efficiently.</p>
      <button class="start-btn" @click="signupAndStart">Get Started</button>
    </section>

    <lottie-player
  autoplay
  loop
  mode="normal"
  src="https://assets8.lottiefiles.com/packages/lf20_ca8zbrdk.json"
  style="max-width: 700px"
>
</lottie-player>
</main>
</div>
  </div>
</template>

<script>
import "@lottiefiles/lottie-player";
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
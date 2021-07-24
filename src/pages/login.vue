<template>
  <div class="login-signup">
    <img class="wave" src="@/assets/wave.svg" alt="" />
    <section class="header-waves">
      <div class="logo">
        <span class="material-icons-outlined logo-icon">space_dashboard</span
        >Trio
      </div>
      <nav class="homepage-nav">
        <router-link to="/" class="login">Home</router-link>
        <span> | </span>
        <router-link to="/signup" class="signup">Sign up</router-link>
      </nav>
    </section>
    <div class="main-container login-container">
      <p>Log in to Trio</p>
      <form @submit.prevent="login">
        <input
          type="text"
          name="username"
          v-model="user.username"
          placeholder="Enter username"
          required
        />
        <input
          type="password"
          name="password"
          v-model="user.password"
          placeholder="Enter password"
          required
        />
        <button class="login">Log in</button>
      </form>
      <router-link class="btn-signup" to="/signup"
        >Sign up for an account</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: null,
        password: null,
      },
    };
  },
  methods: {
    async login() {
      try {
        const user = await this.$store.dispatch({
          type: "login",
          userCred: this.user,
        });
        console.log("user after login", user);
        if (user) this.$router.push(`/b/${this.$store.getters.boards[0]._id}`);
      } catch (err) {
        console.log( "ERROR: cannot login. User and/or password are incorrect", err );
        const msg = {
          txt: "Invalid username or password",
          type: "error",
        };
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
  },
};
</script>
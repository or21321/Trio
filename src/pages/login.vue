<template>
  <div class="login-signup">
    <h1>
      <span class="material-icons-outlined logo-icon">space_dashboard</span>Trio
    </h1>
    <div class="main-container">
        <p>Log in to Trio</p>
        <form @submit.prevent="login">
            <input type="text" name="username" v-model="user.username" placeholder="Enter username" required />
            <input type="password" name="password" v-model="user.password" placeholder="Enter password" required/>
            <button>Log in</button>
        </form>
        <router-link to="/signup">Sign up for an account</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    async login() {
      const user = await this.$store.dispatch({ type: "login", userCred: this.user });
      // TODO: Add memeber to general shared board/s
      if (user) this.$router.push("/b/b101");
    },
  },
};
</script>
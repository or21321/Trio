<template>
  <section class="app-header">
    <nav class="nav">
      <div class="wh">
        <router-link class="btn-container" to="/"
          ><span class="material-icons-outlined">home</span></router-link
        >
      </div>
      <button class="btn-container" :to="'/b/' + 123">
        <span class="material-icons-outlined boards-icon">space_dashboard</span
        ><span> Boards</span>
      </button>
    </nav>

    <div class="logo">
      <span class="material-icons-outlined logo-icon">space_dashboard</span>
      Trio
    </div>

    <div class="header-features">
      <button @click="openBoardCompose" class="material-icons">add</button>
      <div @click="toggleUserMenu">
        <avatar
          class="hover-pointer"
          :size="32"
          username="Or Hadar"
          src="https://res.cloudinary.com/or21321/image/upload/v1626317415/pp_bqtkzw.jpg"
        />
      </div>
    </div>
  </section>
</template>

<script>
import avatar from "vue-avatar";

export default {
  components: {
    avatar,
  },
  methods: {
    openBoardCompose() {
      console.log("openBoardCompose()");
    },
    toggleUserMenu() {
      console.log("toggleUserMenu()");
    },
  },
};
</script>


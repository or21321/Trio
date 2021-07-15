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
      <!-- <button @click="toTodoApp" class="nav-icon material-icons">apps</button>
      <button @click="toHomepage" class="nav-icon material-icons">home</button> -->
      <!-- <div class="search-container"> -->
      <!-- <input
        class="search"
        v-on:keyup="filter"
        placeholder="Search"
        v-model="filterBy.txt"
        debounce="2000"
      /> -->
      <!-- <input class="search" @input="filter" placeholder="Search" v-model="filterBy.txt" debounce="2000"> -->
      <!-- <span class="material-icons">search</span> -->
      <!-- </div> -->
    </nav>
    <div class="logo">
      <span class="material-icons-outlined logo-icon">space_dashboard</span>
      Trio
    </div>
    <!-- <div class="logo">
      <span class="material-icons">space_dashboard</span> Pokito
    </div> -->
    <div class="header-features">
      <button @click="openBoardCompose" class="material-icons">add</button>
      <!-- <span @click="toggleUserProfile" class="material-icons">add</span> -->

      <div @click="openUserMenu">
        <!-- <p>Avatar</p> -->
        <avatar :size="30" username="Or Hadar" src="https://res.cloudinary.com/or21321/image/upload/v1626317415/pp_bqtkzw.jpg" />
      </div>
      <!-- 
      <div v-if="loggedinUser" class="avatar" @click="toggleUserProfile">
        <img :src="avatarUrl" />
      </div> -->
    </div>
  </section>
  <!-- 
  <div class="app-header">
    
    <router-link to="/">Home</router-link> |
    <router-link :to="'/b/'+123">Board</router-link>
  </div> -->
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
    openUserMenu() {
      console.log("openUserMenu()");
    },
  },
};
</script>


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
      <button
        @click="toggleBoardCompose"
        class="material-icons-outlined btn-container"
      >
        add
      </button>
      <div @click="toggleUserMenu">
        <avatar
          class="hover-pointer"
          :size="32"
          :username="fullname"
          :src="imgUrl"
        />
        <!-- src="https://res.cloudinary.com/or21321/image/upload/v1626317415/pp_bqtkzw.jpg" -->
        <!-- "http://res.cloudinary.com/or21321/image/upload/v1626387050/vnodxsvuzaeapjkgxw9g.jpg" -->
      </div>
    </div>
    <board-compose
      @closeCompose="closeBoardCompose"
      v-if="isBoardComposeOn"
    ></board-compose>
  </section>
</template>

<script>
import avatar from "vue-avatar";
import boardCompose from "../cmps/board-compose.vue";

export default {
  data() {
    return {
      isBoardComposeOn: false,
      fullname: null,
      imgUrl: null,
    };
  },
  components: {
    avatar,
    boardCompose,
  },
  created() {
    const user = this.$store.getters.loggedinUser;
    this.fullname = user.fullname;
    this.imgUrl = user.imgUrl;
  },
  methods: {
    toggleBoardCompose() {
      console.log("openBoardCompose()");
      this.isBoardComposeOn = !this.isBoardComposeOn;
    },
    toggleUserMenu() {
      console.log("toggleUserMenu()");
    },
    closeBoardCompose() {
      console.log("Ahalan");
      this.toggleBoardCompose();
    },
  },
};
</script>


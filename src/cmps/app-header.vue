<template>
  <section class="app-header" :class="classBoardsPage">
    <nav class="nav">
      <div class="wh">
        <div class="btn-container" @click="goToBoardsPage"
          ><span class="material-icons-outlined">home</span></div>
      </div>
      <button @click.stop="toggleBoardList" class="btn-container">
        <span class="material-icons-outlined boards-icon">space_dashboard</span>
        <span> Boards</span>
      </button>
    </nav>
    <board-list
      v-if="isBoardListOpen"
      v-clickoutside="hideBoardList"
      @closeBoardList="isBoardListOpen = false"
      @setBackground="setBackground"
      :boards="boards"
    />
    <div class="logo" @click="goToBoardsPage">
      <span class="material-icons-outlined logo-icon">space_dashboard</span>
      <span>Trio</span>
    </div>

    <div class="header-features">
      <button
        @click="toggleBoardCompose"
        class="material-icons-outlined btn-container"
      >
        add
      </button>
      <div @click="isUserMenuOpen = true" class="avatar">
        <avatar
          :size="32"
          :username="user.fullname" 
          :src="user.imgUrl"
          color="#172b4e"
          backgroundColor="#DFE1E6"
          :customStyle="{fontSize:'14px'}"
        />
        <!-- src="https://res.cloudinary.com/or21321/image/upload/v1626317415/pp_bqtkzw.jpg" -->
        <!-- "http://res.cloudinary.com/or21321/image/upload/v1626387050/vnodxsvuzaeapjkgxw9g.jpg" -->
        <user-menu
          class="popup"
          v-if="isUserMenuOpen"
          :user="user"
          @logout="logout"
          @close="isUserMenuOpen = false"
        />
      </div>
    </div>
    <board-compose
      @closeCompose="toggleBoardCompose"
      @addBoard="addBoard"
      v-if="isBoardComposeOn"
    ></board-compose>
  </section>
</template>

<script>
import avatar from "vue-avatar";
import boardCompose from "../cmps/board-compose.vue";
import boardList from "../cmps/board-list.vue";
import userMenu from "../cmps/user-menu.vue";

export default {
  data() {
    return {
      isBoardComposeOn: false,
      isBoardListOpen: false,
      user: null,
      isUserMenuOpen: false,
    };
  },
  components: {
    avatar,
    boardCompose,
    boardList,
    userMenu,
  },
  async created() {
    this.user = this.$store.getters.loggedinUser;
    if (!this.$store.getters.watchedUser) this.$store.dispatch({type:'loadAndWatchUser', userId: this.user._id})
  },
  methods: {
    toggleBoardCompose() {
      this.isBoardComposeOn = !this.isBoardComposeOn;
    },
    toggleUserMenu() {
      console.log("toggleUserMenu()");
    },
    toggleBoardList() {
      this.isBoardListOpen = !this.isBoardListOpen;
    },
    hideBoardList(){
       this.isBoardListOpen = false;
    },
    addBoard(board) {
      this.$emit("addBoard", board);
      this.isBoardComposeOn = false;
    },
    setBackground(style) {
      console.log('from app header', style);
      this.$emit("setBackground", style);
    },
    async logout() {
      await this.$store.dispatch({ type: "logout" });
      this.$router.push("/");
    },
    goToBoardsPage(){
        this.$router.push("/b");
        this.$store.commit({type:'setCurrBoard',board:null})
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
    classBoardsPage(){
      return {'isBoards-page': this.$route.path === '/b'}
    }
  },
};
</script>


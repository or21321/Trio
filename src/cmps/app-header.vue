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
    <div class="logo" @click="goToHomePage">
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
      <div @click.stop="isUserMenuOpen = true" class="avatar">
        <avatar
          :size="32"
          :username="user.fullname" 
          :src="user.imgUrl"
          color="#172b4e"
          backgroundColor="#DFE1E6"
          :customStyle="{fontSize:'14px'}"
        />
        <user-menu
          class="popup"
          v-if="isUserMenuOpen"
          v-clickoutside="hideUserMenu"
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
    if(!this.user && this.$route.path.includes('b/')){
       await this.$store.dispatch({type:'signupAsGuest'})
       this.user = this.$store.getters.loggedinUser;
    }
    if (!this.$store.getters.watchedUser) await this.$store.dispatch({type:'loadAndWatchUser', userId: this.user._id})
  },
  methods: {
    toggleBoardCompose() {
      this.isBoardComposeOn = !this.isBoardComposeOn;
    },
    toggleBoardList() {
      this.isBoardListOpen = !this.isBoardListOpen;
    },
    hideBoardList(){
       this.isBoardListOpen = false;
    },
    hideUserMenu(){
       this.isUserMenuOpen = false;
    },
    addBoard(board) {
      this.$emit("addBoard", board);
      this.isBoardComposeOn = false;
    },
    setBackground(style) {
      this.$emit("setBackground", style);
    },
    async logout() {
      await this.$store.dispatch({ type: "logout" });
      const style = {"background-color": 'whitesmoke' };
      this.setBackground(style)
      this.$router.push("/");
    },
    goToBoardsPage(){
      const style = {"background-color": 'whitesmoke' };
      this.setBackground(style)
         if(this.$route.path !== '/b'){
           this.$router.push("/b");
         }
        this.$store.commit({type:'setCurrBoard',board:null})
    },
    goToHomePage(){
      const style = {"background-color": 'whitesmoke' };
      this.setBackground(style)
        this.$router.push("/");
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


<template>
  <div class="app" :style="{ backgroundColor:this.backgroundColor, backgroundImage:this.backgroundImg}">
    <app-header v-if="!isHome" @addBoard="addBoard" @setBackground="setBackground"/>
    <router-view @setBackground="setBackground" />
    <user-msg />
  </div>
</template>


<script>
import appHeader from "@/cmps/app-header";
import userMsg from './cmps/user-msg';

export default {
  components: {
    appHeader,
    userMsg
  },
  data() {
    return {
      isHome: false,
      backgroundColor: "",
      backgroundImg: "https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/u8lua-4AD76J88AJT-Full-Image_GalleryBackground-en-US-1585673473334._RI_.jpg",
    };
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "loadUsers" });
      await this.$store.dispatch({ type: "loadBoards" });
    } catch (err) {
      console.log("ERROR cannot load users or boards");
    }
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler() {
        const routes = ["/", "/login", "/signup"];
        if (routes.includes(this.$route.path)) this.isHome = true;
        else this.isHome = false;
      },
    },
  },
  methods: {
    async addBoard(board) {
      try {
        const newBoard = await this.$store.dispatch({
          type: "saveBoard",
          board,
        });
        this.$store.commit({ type: "setCurrBoard", board:newBoard });
        this.backgroundColor = board.style["background-color"];
        this.backgroundImg = board.style["background-image"];
        this.$router.push(`/b/${newBoard._id}`);
      } catch (err) {
        console.log("ERROR cannot add board");
      }
    },
    setBackground(style) {
      this.backgroundColor = style["background-color"];
      this.backgroundImg = style["background-image"];
    },
  },
};
</script>




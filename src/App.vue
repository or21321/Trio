<template>
  <div class="app" :style="{ backgroundColor: backgroundColor }">
    <app-header v-if="!isHome" @addBoard="addBoard" @setBackgroundColor="setBackgroundColor"/>
    <router-view @setBackgroundColor="setBackgroundColor" />
  </div>
</template>


<script>
import appHeader from "@/cmps/app-header";

export default {
  components: {
    appHeader,
  },
  data() {
    return {
      isHome: false,
      backgroundImg: null,
      backgroundColor: "#868686",
    };
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "loadBoards" });
    } catch (err) {
      console.log("ERROR cannot load boards");
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
        this.$store.commit({ type: "setCurrBoard", board });
        this.backgroundColor = board.style["background-color"];
        this.$router.push(`/b/${newBoard._id}`);
      } catch (err) {
        console.log("ERROR cannot add board");
      }
    },
    setBackgroundColor(color) {
      this.backgroundColor = color;
    },
  },
};
</script>




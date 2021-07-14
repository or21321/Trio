<template>
  <div class="app">
    <app-header v-if="!isHome"></app-header>
    <router-view />
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
    };
  },
  async created() {
    console.log("App created");
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
        console.log("path", this.$route.path);
        if (this.$route.path === "/") this.isHome = true;
        else this.isHome = false
      },
    },
  },
};
</script>




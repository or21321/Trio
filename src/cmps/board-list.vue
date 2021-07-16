<template>
  <section class="board-list">
    <header class="header-list">
      <input
        ref="searchBoard"
        class="input-search-boards"
        type="text"
        placeholder="Find boards by name..."
      />
      <span class="close material-icons-outlined" @click="closeBoardList"
        >close</span
      >
    </header>
    <main>
      <div class="list-starred" v-if="boardsStarred.length">
        <h2 class="title">
          <span class="material-icons board-header-btn star">star_border</span>
          STARRED BOARDS
        </h2>
        <article
          v-for="board in boardsStarred"
          :key="board._id"
          class="board-preview"
          :style="{ backgroundColor: board.style['background-color'] + '1f' }"
          @click="openBoard(board)"
        >
          <div
            class="bgc"
            :style="{ backgroundColor: board.style['background-color'] }"
          ></div>
          <span> {{ board.title }} </span>
          <span
            :class="{ selected: board.isStarred }"
            @click.stop="toggleStar(board)"
            class="material-icons star"
            >star_border</span
          >
        </article>
      </div>
      <div class="list-all">
        <h2 class="title">ALL BOARDS</h2>
        <article
          v-for="board in boards"
          :key="board._id"
          class="board-preview"
          :style="{ backgroundColor: board.style['background-color'] + '1f' }"
          @click="openBoard(board)"
        >
          <div
            class="bgc"
            :style="{ backgroundColor: board.style['background-color'] }"
          ></div>
          <span> {{ board.title }} </span>
          <span
            :class="{ selected: board.isStarred }"
            @click.stop="toggleStar(board)"
            class="material-icons star"
            >star_border</span
          >
        </article>
      </div>
    </main>
  </section>
</template>

<script>
export default {
  props: {
    boards: {
      type: Array,
      require: true,
    },
  },
  mounted() {
    this.$refs.searchBoard.focus();
  },
  methods: {
    closeBoardList() {
      this.$emit("closeBoardList");
    },
    openBoard(board) {
      console.log("yes");
      if (board._id !== this.$store.getters.currBoard._id) {
        this.$emit("setBackgroundColor", board.style["background-color"]);
        this.$store.commit({ type: "setCurrBoard", board });
        this.$router.push(`/b/${board._id}`);
      }
      this.closeBoardList();
    },
    async toggleStar(board) {
      try {
        board.isStarred = !board.isStarred;
        await this.$store.dispatch({ type: "saveBoard", board });
      //   var currBoardId = this.$route.params.boardId;
      //   this.$store.commit({ type: "setCurrBoard", board:currBoard });
      } catch (err) {
        console.log("Error cannot toggle star", err);
      }
    },
  },
  computed: {
    boardsStarred() {
      return this.boards.filter((board) => board.isStarred);
    },
  },
};
</script>

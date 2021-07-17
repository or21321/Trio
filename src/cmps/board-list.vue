<template>
  <section class="board-list">
    <header class="header-list">
      <input
        ref="searchBoard"
        class="input-search-boards"
        type="text"
        placeholder="Find boards by name..."
        v-model="searchBoard"
        @input="setFilter"
      />
      <span class="close material-icons-outlined" @click="closeBoardList"
        >close</span
      >
    </header>
    <main>
      <section class="regular-listes" v-if="!searchBoard">
        <div class="list-starred" v-if="boardsStarred.length">
          <h2 class="title">
            <span class="material-icons-outlined">star_border</span>STARRED
            BOARDS
            <span
              class="material-icons-outlined close-list"
              v-if="!listClose.includes('boardsStarred')"
              @click="toggleListClose('boardsStarred')"
              >remove</span
            >
            <span
              class="material-icons-outlined close-list"
              v-else
              @click="toggleListClose('boardsStarred')"
              >add</span
            >
          </h2>
          <div class="main-list" v-if="!listClose.includes('boardsStarred')">
            <article
              v-for="board in boardsStarred"
              :key="board._id"
              class="board-preview"
              :style="{
                backgroundColor: board.style['background-color'] + '1f',
              }"
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
        </div>

        <div class="list-recent" v-if="recentBoards.length">
          <h2 class="title">
            <span class="material-icons-outlined">history</span>RECENT BOARDS
            <span
              class="material-icons-outlined close-list"
              v-if="!listClose.includes('recentBoards')"
              @click="toggleListClose('recentBoards')"
              >remove</span
            >
            <span
              class="material-icons-outlined close-list"
              v-else
              @click="toggleListClose('recentBoards')"
              >add</span
            >
          </h2>
          <div class="main-list" v-if="!listClose.includes('recentBoards')">
            <article
              v-for="board in recentBoards"
              :key="board._id"
              class="board-preview"
              :style="{
                backgroundColor: board.style['background-color'] + '1f',
              }"
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
        </div>

        <div class="list-all">
          <h2 class="title">
            <span class="material-icons-outlined">toc</span>ALL BOARDS
            <span
              class="material-icons-outlined close-list"
              v-if="!listClose.includes('boards')"
              @click="toggleListClose('boards')"
              >remove</span
            >
            <span
              class="material-icons-outlined close-list"
              v-else
              @click="toggleListClose('boards')"
              >add</span
            >
          </h2>
          <div class="main-list" v-if="!listClose.includes('boards')">
            <article
              v-for="board in boards"
              :key="board._id"
              class="board-preview"
              :style="{
                backgroundColor: board.style['background-color'] + '1f',
              }"
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
        </div>
      </section>
      <section class="search-list" v-else>
        <div class="main-list">
          <article
            v-for="board in boardsAfterFilter"
            :key="board._id"
            class="board-preview"
            :style="{
              backgroundColor: board.style['background-color'] + '1f',
            }"
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
      </section>
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
  data() {
    return {
      recentBoards: this.$store.getters.recentBoards,
      listClose: [],
      searchBoard: "",
    };
  },
  mounted() {
    this.$refs.searchBoard.focus();
  },
  methods: {
    closeBoardList() {
      this.$emit("closeBoardList");
    },
    openBoard(board) {
      this.$store.commit({ type: "addBoardToRecentBoards", board });
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
        var boardId = this.$route.params.boardId;
        const currBoard = await this.$store.dispatch({
          type: "getBoardById",
          boardId,
        });
        this.$store.commit({ type: "setCurrBoard", board: currBoard });
      } catch (err) {
        console.log("Error cannot toggle star", err);
      }
    },
    toggleListClose(listName) {
      const listIdx = this.listClose.findIndex((list) => list === listName);
      if (listIdx === -1) {
        this.listClose.push(listName);
      } else {
        this.listClose.splice(listIdx, 1);
      }
    },
    setFilter(){
       this.$store.commit({type: "setFilterBy", filterBy:{txt:this.searchBoard}})
      },
  },
  computed: {
    boardsStarred() {
      return this.boards.filter((board) => board.isStarred);
    },
    boardsAfterFilter() {
      return this.$store.getters.boardsToShow
    },
  },
};
</script>

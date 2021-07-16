<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header
      :title="board.title"
      :star="board.isStarred"
      @updateTitle="updateTitle"
      @toggleStar="toggleStar"
    ></board-header>
    <!-- * for when dragscroll is working with draggable -->
    <!-- <div v-dragscroll class="board-canvas my-scrollbar"> -->
    <div class="board-canvas my-scrollbar">
      <groupList
        v-for="group in board.groups"
        :key="group.id"
        :group="group"
        :boardId="board._id"
        @removeGroup="removeGroup"
      ></groupList>
      <group-compose :boardId="boardId"></group-compose>
    </div>
    <router-view />
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";
import boardHeader from "@/cmps/board-header";
import groupCompose from "@/cmps/group-compose";
// import { dragscroll } from "vue-dragscroll";

export default {
  // need to make dragscroll work with draggable
  // directives: {
  //   dragscroll,
  // },
  components: {
    groupList,
    boardHeader,
    groupCompose,
  },
  async created() {
    console.log("board created, boardId:", this.boardId);
    try {
      await this.$store.dispatch({
        type: "loadBoard",
        boardId: this.$route.params.boardId,
      });
    } catch (err) {
      console.log("ERROR: cannot get board");
    }
  },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    board() {
      return this.$store.getters.currBoard;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    async updateTitle(title) {
      console.log("updateTitle()", title);
      // this.board.title = title
      // await this.$store.dispatch({ type: "saveBoard", board: this.board });
    },
    toggleStar() {
      this.board.isStarred = !this.board.isStarred;
      this.$store.dispatch({ type: "saveBoard", board: this.board });
    },
    removeGroup(groupId) {
      this.$store.dispatch({
        type: "removeGroup",
        groupId,
        boardId: this.board._id,
      });
    },
  },
};
</script>
<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header
      :title="board.title"
      :star="board.isStarred"
      @toggleStar="toggleStar"
    ></board-header>
    <div class="board-canvas">
      <groupList
        v-for="group in board.groups"
        :key="group.id"
        :group="group"
        :boardId="board._id"
      ></groupList>
      <group-compose :boardId="boardId"></group-compose>
    </div>
    <router-view />
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";
import boardHeader from "@/cmps/board-header";
import groupCompose from '@/cmps/group-compose'

export default {
  components: {
    groupList,
    boardHeader,
    groupCompose
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
      return this.$store.getters.currBoard
    }
  },
  methods: {
    toggleStar() {
      this.board.isStarred = !this.board.isStarred;
      this.$store.dispatch({ type: "saveBoard", board: this.board });
    }
  },
  data() {
    return {
      // board: null,
    };
  },
};
</script>




<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header :title="board.title"> </board-header>
    <div class="board-canvas">
     <groupList
        v-for="group in board.groups"
        :key="group.id"
        :group="group"
        :boardId="board._id"
      ></groupList>
    </div>
    <router-view />
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";
import boardHeader from "@/cmps/board-header";

export default {
  components: {
    groupList,
    boardHeader,
  },
  async created() {
    console.log("board created, boardId:", this.boardId);
    try {
      this.board = await this.$store.dispatch({
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
  },
  methods: {},
  data() {
    return {
      board: null,
    };
  },
};

</script>




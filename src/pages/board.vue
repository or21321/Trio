<template>
  <div class="board app-main" v-if="board">
    <h2>{{ board.title }}</h2>

    <div class="board-groups">
      <groupList
        v-for="group in board.groups"
        :key="group.id"
        :group="group"
      ></groupList>
    </div>
    <router-view />
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";

export default {
  components: {
    groupList,
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




<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header
      :board="board"
      @updateTitle="updateTitle"
      @toggleStar="toggleStar"
      @updateMembers="updateMembers"
    ></board-header>
    <!-- * for when dragscroll is working with draggable -->
    <div v-dragscroll:nochilddrag class="board-canvas my-scrollbar">
      <!-- <div class="board-canvas my-scrollbar"> -->
      <draggable
        data-dragscroll
        :list="board.groups"
        :animation="200"
        ghost-class="ghost-card"
        group="groups"
        @end="saveBoard"
      >
        <groupList
          v-for="group in board.groups"
          :key="group.id"
          :group="group"
          :board="board"
          :darkWindow="darkWindow"
          @removeGroup="removeGroup"
          @updateBoard="saveBoard"
          @toggleLabelsTitles="toggleLabelsTitles"
          @setToPreviewEdit="setToPreviewEdit"
          :isCardPreviewLabelsShown="isCardPreviewLabelsShown"
        ></groupList>
      </draggable>
      <group-compose :boardId="boardId"></group-compose>
    </div>
    <router-view />
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";
import boardHeader from "@/cmps/board-header";
import groupCompose from "@/cmps/group-compose";
import { dragscroll } from "vue-dragscroll";
import draggable from "vuedraggable";
import { socketService } from "@/services/socket.service.js";
import { SOCKET_EMIT_BOARD_WATCH } from "@/services/socket.service.js";

export default {
  directives: {
    dragscroll,
  },
  components: {
    groupList,
    boardHeader,
    groupCompose,
    draggable,
  },
  props:{
     darkWindow:{
        type:Boolean
     }
  },
  // async created() {
  //   try {
  //     await this.$store.dispatch({
  //       type: "loadBoard",
  //       boardId: this.$route.params.boardId,
  //     });
  //     this.$emit("setBackground", this.board.style);
  //   } catch (err) {
  //     console.log("ERROR: cannot get board");
  //   }
  // },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    board() {
      return this.$store.getters.currBoard;
    },
  },
  watch: {
    "$route.params.boardId": {
      immediate: true,
      async handler() {
        console.log("handler on board");
        const { boardId } = this.$route.params;
        try {
          const currBoard = await this.$store.dispatch({
            type: "loadBoard",
            boardId: this.$route.params.boardId,
          });
          this.$emit("setBackground", currBoard.style);
          // console.log('********activities', currBoard.activities)
          // SOCKET
          console.log("SOCKET_EMIT_BOARD_WATCH", SOCKET_EMIT_BOARD_WATCH);
          socketService.emit(SOCKET_EMIT_BOARD_WATCH, boardId);
          socketService.on("board updated", this.loadBoard);
        } catch (err) {
          console.log("ERROR: cannot get board");
        }
      },
    },
  },
  data() {
    return {
      isCardPreviewLabelsShown: false,
    };
  },
  methods: {
    loadBoard() {
      console.log("loadBoard from board.vue");
      this.$store.dispatch({ type: "loadBoard", boardId: this.board._Id });
    },
    toggleLabelsTitles() {
      this.isCardPreviewLabelsShown = !this.isCardPreviewLabelsShown;
    },
    async updateTitle(title) {
      console.log("updateTitle()", title);
      this.board.title = title;
      await this.$store.dispatch({ type: "saveBoard", board: this.board });
    },
    async toggleStar() {
      try {
        this.board.isStarred = !this.board.isStarred;
        this.$store.dispatch({ type: "saveBoard", board: this.board });
      } catch (err) {
        console.log("ERROR: cannot save board ", err);
      }
    },
    async removeGroup(groupId) {
      var msg = {};
      try {
        const group = await this.$store.dispatch({type: "getGroupById", groupId, boardId: this.board._id});
        await this.$store.dispatch({
          type: "removeGroup",
          groupId,
          boardId: this.board._id,
        });
        msg = {
          txt: "List was successfully removed",
          type: "success",
        };
        const activity = {txt: `deleted list ${group.title}`, byMember: this.$store.getters.getMyMiniUser }
        await this.$store.dispatch({type: "addActivity", activity, boardId: this.board._id});
      } catch (err) {
        msg = {
          txt: "Fail remove list, try again later",
          type: "error",
        };
        throw err;
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    saveBoard(board) {
      try {
        this.$store.dispatch({ type: "saveBoard", board });
      } catch (err) {
        console.log("Error saving board:", err);
      }
    },
    async updateMembers(members) {
      const updatedBoard = this.board;
      updatedBoard.members = members;
      console.log("updated board", updatedBoard);
      this.saveBoard(updatedBoard);
    },
    setToPreviewEdit(deff) {
      this.$emit("setToPreviewEdit",deff);
    },
  },
};
</script>
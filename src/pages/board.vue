<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header
      :board="board"
      @updateTitle="updateBoardTitle"
      @toggleStar="toggleStar"
      @updateMembers="updateMembers"
      @setBackground="setBackground"
      @openDashboard="isDashboardOpen = true"
    ></board-header>
    <div v-dragscroll:nochilddrag class="board-canvas my-scrollbar">
      <draggable
        ghost-class="ghost-card"
        data-dragscroll
        :list="board.groups"
        :animation="200"
        group="groups"
        @end="updateBoardAfterDrag"
        ref="group"
      >
        <!-- @start="dragStart" -->
        <!-- :dragged="dragHandler" -->
        <!-- :clone="(original) => clone(original)" -->
        <!-- @end="saveBoard" -->
        <group-list
          v-for="group in board.groups"
          :key="group.id"
          :group="group"
          :board="board"
          :darkWindow="darkWindow"
          :isCardPreviewLabelsShown="isCardPreviewLabelsShown"
          @socketUpdateBoard="socketUpdateBoard"
          @updateBoardAfterDrag="updateBoardAfterDrag"
          @removeGroup="removeGroup"
          @updateCard="updateCard"
          @updateGroup="updateGroup"
          @toggleLabelsTitles="toggleLabelsTitles"
          @setToPreviewEdit="setToPreviewEdit"
          :loggedinUser="loggedinUser"
        ></group-list>
        <!-- <div class="drag-preview" :style="dragStyle" ref="dragPreview"></div> -->
      </draggable>
      <group-compose
        :boardId="boardId"
        :isBoardEmpty="isBoardEmpty"
        @socketUpdateBoard="socketUpdateBoard"
      ></group-compose>
    </div>
    <router-view
      @socketUpdateBoard="socketUpdateBoard"
      :loggedinUser="loggedinUser"
    />
    <dashboard
      v-if="isDashboardOpen"
      :board="board"
      @closeDashboard="isDashboardOpen = false"
    />
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";
import boardHeader from "@/cmps/board-header";
import groupCompose from "@/cmps/group-compose";
import dashboard from "../cmps/dashboard.vue";
import { dragscroll } from "vue-dragscroll";
import draggable from "vuedraggable";
import { socketService } from "@/services/socket.service.js";
import { SOCKET_EMIT_BOARD_WATCH } from "@/services/socket.service";
import { SOCKET_EMIT_BOARD_UPDATE } from "@/services/socket.service";
import { eventBus } from "@/services/event-bus-service";
// import { SOCKET_ON_BOARD_UPDATE} from '@/services/socket.service'

export default {
  directives: {
    dragscroll,
  },
  components: {
    groupList,
    boardHeader,
    groupCompose,
    dashboard,
    draggable,
  },
  props: {
    darkWindow: {
      type: Boolean,
    },
    loggedinUser: {
      immediate: true,
      type: Object,
    },
  },
  async created() {
    try {
      eventBus.$on("addActivity", async (activity) => {
        await this.$store.dispatch({ type: "addActivity", activity });
      });
    } catch (err) {
      console.log("ERROR, cannot SignupAsGuest or addActivity", err);
    }
  },
  // mounted() {
  //   setTimeout(() => {
  //     console.log("AH", this.$refs.group);
  //     const groups = this.$refs.group;
  //     groups.forEach((g) => {
  //       console.log('G', g.$el);
  //       g.$el.addEventListener("drag", function (e) {
  //         this.x = e.x;
  //         this.y = e.y;
  //         console.log("this.x", this.x);
  //         console.log("this.y", this.y);
  //       });
  //     });
  //   }, 150);
  // },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    board() {
      console.log("***");
      return this.$store.getters.currBoard;
    },
    isBoardEmpty() {
      return this.board.groups.length === 0 ? true : false;
    },
    unfilteredBoard() {
      return this.$store.state.boardStore.currBoard;
    },
    // dragStyle() {
    //   return {
    //     'top': `${this.y}px`,
    //     'left': `${this.x}px`,
    //   };
    // },
  },
  watch: {
    "$route.params.boardId": {
      immediate: true,
      async handler() {
        const { boardId } = this.$route.params;
        try {
          console.log("YALLOW");
          const currBoard = await this.$store.dispatch({
            type: "loadBoard",
            boardId,
          });
          console.log("from board view", currBoard);
          this.$emit("setBackground", currBoard.style);
          socketService.emit(SOCKET_EMIT_BOARD_WATCH, this.boardId);
        } catch (err) {
          console.log("ERROR: cannot get board");
        }
      },
    },
    "unfilteredBoard.style": {
      handler() {
        this.$emit("setBackground", this.unfilteredBoard.style);
      },
    },
    x: {
      handler() {
        console.log("Heyo", this.x);
      },
    },
  },
  data() {
    return {
      isCardPreviewLabelsShown: false,
      isDashboardOpen: false,
      x: 0,
      y: 0,
      dragPreview: null,
    };
  },
  methods: {
    async updateBoardAfterDrag() {
      try {
        console.log("Ahalan ya habub", this.board);
        await this.$store.dispatch({
          type: "saveBoardAfterDrag",
          board: this.board,
        });
        this.socketUpdateBoard();
      } catch (err) {
        console.log("Had a problem updating board after drag", err);
        var msg = {
          txt: "Failed to drag items, try again without active filter",
          type: "error",
        };
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    async updateCard(card, groupId) {
      try {
        console.log("from board, updateCard", card, groupId, this.board._id);
        await this.$store.dispatch({
          type: "saveCard",
          card: card,
          groupId: groupId,
          boardId: this.board._id,
        });
        console.log("da", this.$store.state);
        this.socketUpdateBoard();
      } catch (err) {
        console.log("Had a problem updating card from board", err);
      }
    },
    async updateGroup(group) {
      console.log("from board, updateGroupTitle", group, this.board._id);
      // const groupToSave = await this.$store.dispatch({
      //   type: "getGroupById",
      //   groupId: group.id,
      //   boardId: this.board._id,
      // });
      const groupToSave = JSON.parse(JSON.stringify(group));
      groupToSave.title = group.title;
      await this.$store.dispatch({
        type: "saveGroup",
        group: group,
        boardId: this.board._id,
      });
      this.socketUpdateBoard();
    },
    //  dragStart(e) {
    //    console.log("e", e);
    //    console.log("refs", this.$refs);
    //    this.dragPreview = e.originalEvent.target.cloneNode(true);
    //    this.$refs["dragPreview"].appendChild(this.dragPreview);

    //    e.originalEvent.dataTransfer.setDragImage(new Image(), 0, 0);
    //  },
    // dragEnd() {
    // this.dragPreview.remove();
    // this.dragPreview = null;
    // this.saveBoard();
    // },
    // clone(original) {
    //   console.log('original', original);
    //   return original
    // },
    // dragHandler(event, originalEvent) {
    //   console.log("DRAG HANDLER, event", event);
    //   console.log("DRAG HANDLER, originalEvent", originalEvent);
    //   this.x = originalEvent.pageX;
    //   this.y = originalEvent.pageY;
    //   console.log("this.x", this.x);
    //   console.log("this.y", this.y);
    // },
    socketUpdateBoard() {
      console.log("SOCKETUPDATEBOARDMOTHREREUFJKER SOCKETING");
      socketService.emit(SOCKET_EMIT_BOARD_UPDATE, this.unfilteredBoard);
    },
    loadBoard() {
      this.$store.dispatch({ type: "loadBoard", boardId: this.board._Id });
    },
    toggleLabelsTitles() {
      this.isCardPreviewLabelsShown = !this.isCardPreviewLabelsShown;
    },
    async updateBoardTitle(title) {
      try {
        const boardToSave = JSON.parse(JSON.stringify(this.unfilteredBoard));
        console.log("boardToSave", boardToSave);
        boardToSave.title = title;
        console.log("title", boardToSave.title);
        await this.$store.dispatch({ type: "saveBoard", board: boardToSave });
        this.socketUpdateBoard();
      } catch (err) {
        console.log("Had a problem updating board title", err);
      }
    },
    async toggleStar() {
      try {
        const boardToSave = this.unfilteredBoard;
        boardToSave.isStarred = !boardToSave.isStarred;
        await this.$store.dispatch({ type: "saveBoard", board: boardToSave });
        this.socketUpdateBoard();
      } catch (err) {
        console.log("ERROR: cannot save board ", err);
      }
    },
    async removeGroup(groupId) {
      var msg = {};
      try {
        const group = await this.$store.dispatch({
          type: "getGroupById",
          groupId,
          boardId: this.board._id,
        });
        await this.$store.dispatch({
          type: "removeGroup",
          groupId,
          boardId: this.board._id,
        });
        msg = {
          txt: "List was successfully removed",
          type: "success",
        };
        const activity = { txt: `deleted list ${group.title}` };
        eventBus.$emit("addActivity", activity);
        this.socketUpdateBoard();
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
    async saveBoard(board) {
      try {
        const boardToSave = board ? board : this.board;
        await this.$store.dispatch({ type: "saveBoard", board: boardToSave });
        this.socketUpdateBoard();
      } catch (err) {
        console.log("Error saving board:", err);
      }
    },
    async updateMembers(members) {
      try {
        const boardToSave = this.unfilteredBoard;
        boardToSave.members = members;
        this.saveBoard(boardToSave);
      } catch (err) {
        console.log("Had a problem updating members", err);
      }
    },
    setToPreviewEdit(deff) {
      this.$emit("setToPreviewEdit", deff);
    },
    async setBackground(style) {
      try {
        const boardToSave = this.unfilteredBoard;
        boardToSave.style = style;
        await this.saveBoard(boardToSave);
        this.socketUpdateBoard();
        // this.$emit("setBackground", style);
      } catch (err) {
        console.log("Had problem setting background", err);
      }
    },
  },
  beforeDestroy() {
    eventBus.$off("addActivity");
  },
};
</script>
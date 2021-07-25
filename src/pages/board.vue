<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header
      :board="board"
      @updateTitle="updateTitle"
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
        @end="dragEnd"
        @start="dragStart"
        ref="group"
        :clone="dragHandler"
      >
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
          @removeGroup="removeGroup"
          @updateBoard="saveBoard"
          @toggleLabelsTitles="toggleLabelsTitles"
          @setToPreviewEdit="setToPreviewEdit"
          :loggedinUser="loggedinUser"
        ></group-list>
        <div class="drag-preview" :style="dragStyle" ref="dragPreview"></div>
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
    dragStyle() {
      return {
        'top': `${this.y}px`,
        'left': `${this.x}px`,
      };
    },
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
    dragStart(e) {
      console.log("e", e);
      console.log("refs", this.$refs);
      this.dragPreview = e.originalEvent.target.cloneNode(true);
      this.$refs["dragPreview"].appendChild(this.dragPreview);

      e.originalEvent.dataTransfer.setDragImage(new Image(), 0, 0);
    },
    dragEnd() {
      this.dragPreview.remove();
      this.dragPreview = null;
      this.saveBoard();
    },
    // clone(original) { 
    //   console.log('original', original);
    //   return original
    // },
    dragHandler(event, originalEvent) {
      console.log("DRAG HANDLER, event", event);
      console.log("DRAG HANDLER, originalEvent", originalEvent);
      this.x = originalEvent.pageX;
      this.y = originalEvent.pageY;
      console.log("this.x", this.x);
      console.log("this.y", this.y);
    },
    socketUpdateBoard() {
      socketService.emit(SOCKET_EMIT_BOARD_UPDATE, this.board);
    },
    loadBoard() {
      this.$store.dispatch({ type: "loadBoard", boardId: this.board._Id });
    },
    toggleLabelsTitles() {
      this.isCardPreviewLabelsShown = !this.isCardPreviewLabelsShown;
    },
    async updateTitle(title) {
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
      const updatedBoard = this.board;
      updatedBoard.members = members;
      this.saveBoard(updatedBoard);
    },
    setToPreviewEdit(deff) {
      this.$emit("setToPreviewEdit", deff);
    },
    async setBackground(style) {
      try {
        const boardToSave = JSON.parse(JSON.stringify(this.board));
        boardToSave.style = style;
        console.log("boardToSave", boardToSave);
        await this.saveBoard(boardToSave);
        this.$emit("setBackground", style);
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
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
        data-dragscroll
        :list="board.groups"
        :animation="200"
        ghost-class="ghost-card"
        group="groups"
        @end="saveBoard"
      >
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
    <dashboard v-if="isDashboardOpen"
    :board="board"
    @closeDashboard="isDashboardOpen = false"/>
  </div>
</template>

<script>
import groupList from "@/cmps/group-list";
import boardHeader from "@/cmps/board-header";
import groupCompose from "@/cmps/group-compose";
import dashboard from '../cmps/dashboard.vue'
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
  async created(){
     try{
      //   if(!this.$store.getters.loggedinUser){
      //      console.log('yes');
      //      await this.$store.dispatch({type: "signupAsGuest"});
      //   }
         eventBus.$on("addActivity", async (activity)=> {
            await this.$store.dispatch({type: "addActivity", activity});
         })
     }catch(err){
        console.log('ERROR, cannot SignupAsGuest or addActivity', err);
     }
  },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    board() {
      return this.$store.getters.currBoard;
    },
    isBoardEmpty() {
      return this.board.groups.length === 0 ? true : false;
    },
  },
  watch: {
    "$route.params.boardId": {
      immediate: true,
      async handler() {
        const { boardId } = this.$route.params;
        try {
          const currBoard = await this.$store.dispatch({
            type: "loadBoard",
            boardId,
          });
          this.$emit("setBackground", currBoard.style);
          socketService.emit(SOCKET_EMIT_BOARD_WATCH, this.boardId);
        } catch (err) {
          console.log("ERROR: cannot get board");
        }
      },
    },
  },
  data() {
    return {
      isCardPreviewLabelsShown: false,
      isDashboardOpen:false
    };
  },
  methods: {
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
        const activity = {txt: `deleted list ${group.title}`}
        eventBus.$emit("addActivity", activity)
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
    async saveBoard() {
      try {
        await this.$store.dispatch({ type: "saveBoard", board: this.board });
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
        await this.saveBoard(boardToSave);
        this.$emit("setBackground", style);
      } catch (err) {
        console.log("Had problem setting background", err);
      }
    },
  },
  beforeDestroy(){
    eventBus.$off("addActivity")
  },
};
</script>
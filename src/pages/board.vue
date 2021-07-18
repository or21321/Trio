<template>
  <div class="board-wrapper app-main" v-if="board">
    <board-header
      :title="board.title"
      :star="board.isStarred"
      :members="board.members"
      @updateTitle="updateTitle"
      @toggleStar="toggleStar"
    ></board-header>
    <!-- * for when dragscroll is working with draggable -->
    <!-- <div v-dragscroll class="board-canvas my-scrollbar"> -->
    <div class="board-canvas my-scrollbar">
      <!-- <draggable
        :list="board.groups"
        :animation="200"
        ghost-class="ghost-card"
        group="groups"
        @end="saveBoard"
        handle=".handle"
      > -->
        <groupList
          v-for="group in board.groups"
          :key="group.id"
          :group="group"
          :board="board"
          @removeGroup="removeGroup"
          @updateBoard="saveBoard"
          @toggleLabelsTitles="toggleLabelsTitles"
          :isCardPreviewLabelsShown="isCardPreviewLabelsShown"
        ></groupList>
      <!-- </draggable> -->
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
    try {
      await this.$store.dispatch({
        type: "loadBoard",
        boardId: this.$route.params.boardId,
      });
      this.$emit("setBackground", this.board.style);
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
      isCardPreviewLabelsShown: false
    };
  },
  methods: {
    toggleLabelsTitles() {  
      this.isCardPreviewLabelsShown = !this.isCardPreviewLabelsShown
    },
    async updateTitle(title) {
      console.log("updateTitle()", title);
      this.board.title = title
      await this.$store.dispatch({ type: "saveBoard", board: this.board });
    },
    async toggleStar() {
       try{
         this.board.isStarred = !this.board.isStarred;
         this.$store.dispatch({ type: "saveBoard", board: this.board });
       }catch(err){
          console.log('ERROR: cannot save board ', err);
       }
    },
    async removeGroup(groupId) {
        var msg = {}
      try {
        this.$store.dispatch({
          type: "removeGroup",
          groupId,
          boardId: this.board._id,
        });
         msg = {
           txt:'List was successfully removed',
           type:'success'
        }
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
      this.$store.dispatch({ type: "saveBoard", board });
    },
  },
};
</script>
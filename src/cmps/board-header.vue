<template>
  <div class="board-header">
    <div class="board-section">
      <contenteditable
        v-if="isEditing"
        class="board-header-btn"
        tag="span"
        :contenteditable="true"
        v-model="boardTitle"
        :noNL="false"
        :noHTML="true"
        @keypress.enter="updateTitle"
        @input="updateTitleDebounce"
      />
      <h1 v-else class="board-header-btn" @click="isEditing = !isEditing">
        {{ boardTitle }}
      </h1>
      <!-- <span class="material-icons">dashboard</span>
      <span class="">{{ title }}</span>
      <span class="material-icons">keyboard_arrow_down</span> -->
      <span
        class="material-icons board-header-btn star"
        @click="toggleStar"
        :class="selected"
        >star_border</span
      >
    </div>
    <div class="members-section">
      <section class="avatars" v-if="board.members.length">
        <avatar
          v-for="member in board.members"
          :key="member.id"
          :username="member.fullname"
          :src="member.imgUrl"
          :size="28"
          backgroundColor="#DFE1E6"
          color="#172b4d"
          :customStyle="{ fontSize: '12px' }"
        />
      </section>
      <button
        class="board-header-btn invite-btn"
        @click.stop="toggleMemberMenu"
      >
        Invite
      </button>
      <boardMembersEdit
        v-if="isMembersMenuOpen"
        v-clickoutside="closeMembersMenu"
        :users="users"
        :members="board.members"
        class="popup members-popup"
        @updateMembers="updateMembers"
        @close="isMembersMenuOpen = false"
      />
      <!-- @updateBoard="updateBoard" -->
    </div>
    <div class="menu-section">
      <button
        class="board-header-btn menu-section"
        @click.stop="isSideMenuOpen = true"
      >
        <span class="material-icons title">more_horiz</span>
        Show menu
      </button>
      <transition name="slide">
        <sideMenu
          v-if="isSideMenuOpen"
          v-clickoutside="closeSideMenu"
          :board="board"
          class="popup"
          @updateMembers="updateMembers"
          @close="isSideMenuOpen = false"
          @removeBoard="removeBoard"
          @setBackground="setBackground"
        />
        <!-- class="popup members-popup" -->
      </transition>
    </div>
  </div>
</template>

<script>
import boardMembersEdit from "@/cmps/board-members-edit";
import sideMenu from "@/cmps/side-menu";
import avatar from "vue-avatar";
import { debounce } from "@/services/util.service";

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      boardTitle: null,
      isEditing: true,
      isMembersMenuOpen: false,
      isSideMenuOpen: false,
    };
  },
  computed: {
    selected() {
      return { selected: this.board.isStarred };
    },
    users() {
      return this.$store.getters.users;
    },
  },
  created() {
    this.updateTitleDebounce = debounce(this.updateTitle, 2500);
  },
  watch: {
    "$route.params.boardId": {
      immediate: true,
      handler() {
        setTimeout(() => {
          this.board = this.$store.getters.currBoard;
          this.boardTitle = JSON.parse(JSON.stringify(this.board.title));
        }, 150);
      },
    },
  },
  //   mounted() {
  //     setTimeout(() => {
  //       this.$refs.header.$el.addEventListener("focusout", this.updateTitle);
  //       this.isEditing = false;
  //     }, 1);
  //   },
  methods: {
    setBackground(style) {
      this.$emit("setBackground", style);
    },
     toggleMemberMenu(){
        this.isMembersMenuOpen = !this.isMembersMenuOpen;
     },
     closeMembersMenu(){
        this.isMembersMenuOpen = false;
     },
     closeSideMenu(){
        this.isSideMenuOpen = false;
     },
    updateTitleDebounce() {
      this.updateTitle();
    },
    toggleStar() {
      this.$emit("toggleStar");
    },
    updateTitle() {
      // this.boardTitle = ev.target.textContent
      this.isEditing = !this.isEditing;
      this.$emit("updateTitle", this.boardTitle);
    },
    updateMembers(members) {
      this.$emit("updateMembers", members);
    },
    async removeBoard(boardId) {
      var msg = {};
      try {
        await this.$store.dispatch({ type: "removeBoard", boardId });
        this.$store.commit({
          type: "removeBoardFromRecentBoards",
          board: this.board,
        });
        this.$router.push(`/b/${this.$store.getters.boards[0]._id}`);
        msg = {
          txt: "Board was successfully removed",
          type: "success",
        };
      } catch (err) {
        msg = {
          txt: "Failed to remove board, try again later",
          type: "error",
        };
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
  },
  components: {
    boardMembersEdit,
    avatar,
    sideMenu,
  },
};
</script>
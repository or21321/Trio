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
      <section class="avatars" v-if="members.length">
        <avatar
          v-for="member in members"
          :key="member.id"
          :username="member.fullname"
          :src="member.imgUrl"
          :size="28"
        />
      </section>
      <button
        class="board-header-btn invite-btn"
        @click="isMembersMenuOpen=true"
      >
        Invite
      </button>
      <boardMembersEdit
        v-if="isMembersMenuOpen"
        :users="users"
        :members="members"
        class="popup members-popup"
        @updateMembers="updateMembers"
        @close="isMembersMenuOpen = false"
      />
      <!-- @updateBoard="updateBoard" -->
    </div>
    <div class="menu-section">
      <button class="board-header-btn menu-section" @click="isSideMenuOpen=true">
        <span class="material-icons title">more_horiz</span>
        Show menu
      </button>
      <transition name="slide">
        <sideMenu
          v-if="isSideMenuOpen"
          :board="board"
          class="popup members-popup"
          @updateMembers="updateMembers"
          @close="isSideMenuOpen = false"
          @removeBoard="removeBoard"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import boardMembersEdit from "@/cmps/board-members-edit";
import sideMenu from "@/cmps/side-menu";
import avatar from "vue-avatar";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    star: {
      type: Boolean,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      board: null,
      boardTitle: null,
      isEditing: true,
      isMembersMenuOpen: false,
      isSideMenuOpen: false
    };
  },
  computed: {
    selected() {
      return { selected: this.star };
    },
    users() {
      return this.$store.getters.users;
    },
  },
  watch: {
    "title": {
      immediate: true,
      handler() {
        this.boardTitle = JSON.parse(JSON.stringify(this.title));
      },
    },
    "$route.params.boardId": {
      immediate: true,
      handler() {
        setTimeout(()=>{
          this.board = this.$store.getters.currBoard
        },150)
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
    async removeBoard(boardId){
      try {
        await this.$store.dispatch({type:"removeBoard", boardId })
        await this.$store.commit({type:"removeBoardFromRecentBoards", board: this.board })
        this.$router.push(`/b/${this.$store.getters.boards[0]._id}`);
       } catch (err) {
        console.log("ERROR: failures while removing board ", err);
      }
    }
  },
  components: {
    boardMembersEdit,
    avatar,
    sideMenu
  },
};
</script>
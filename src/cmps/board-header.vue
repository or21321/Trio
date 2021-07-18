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
        @="updateTitle"
        @keypress.enter="updateTitle"
        ref="header"
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
          :size="32"
        />
      </section>
      <button
        class="board-header-btn invite-btn"
        @click="isMembersMenuOpen=true"
      >
        Invite
      </button>
      <cardMembersEdit
        v-if="isMembersMenuOpen"
        :action="action"
        class="popup members-popup"
        @close="isMembersMenuOpen = false"
      />
        <!-- @updateBoard="updateBoard" -->
    </div>
    <div class="menu-section">
      <button class="board-header-btn menu-section">
        <span class="material-icons">more_horiz</span>
        Show menu
      </button>
    </div>
  </div>
</template>

<script>
import cardMembersEdit from "@/cmps/dynamic/card-members-edit";
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
      boardTitle: null,
      isEditing: true,
      isMembersMenuOpen: false,
      action: {name: 'Members'}
    };
  },
  computed: {
    selected() {
      return { selected: this.star };
    },
  },
  watch:{
     "title": {
        immediate: true,
         handler() {
            this.boardTitle = JSON.parse(JSON.stringify(this.title));
         }
     }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.header.$el.addEventListener("focusout", this.updateTitle);
      this.isEditing = false;
    }, 1);
  },
  methods: {
    toggleStar() {
      this.$emit("toggleStar");
    },
    updateTitle() {
      // this.boardTitle = ev.target.textContent
      this.isEditing = !this.isEditing;
      this.$emit("updateTitle", this.boardTitle);
    },
  },
  components: {
    cardMembersEdit,
    avatar,
  },
};
</script>
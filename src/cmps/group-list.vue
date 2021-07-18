<template>
  <div class="group-list">
    <div class="group-header">
      <!-- <h2>{{ group.title }}</h2> -->
          <contenteditable
            tag="h2"
            class="group-title"
            :contenteditable="true"
            v-model="group.title"
            :noNL="false"
            :noHTML="true"
            @input="saveGroupTitle"
          />
    </div>
    <span @click="toggleGroupMenu" class="material-icons group-extras-menu">
      more_horiz
    </span>
    <group-menu
      class="popup"
      :group="group"
      v-if="isGroupMenuOpen"
      @closeGroupMenu="isGroupMenuOpen = false"
      @removeGroup="removeGroup"
    />
    <div class="card-preview-list">
      <draggable
        :list="group.cards"
        :animation="200"
        ghost-class="ghost-card"
        group="cards"
        @end="updateBoard"
      >
        <card-preview
          v-for="card in group.cards"
          :key="card.id"
          :card="card"
          :groupId="group.id"
          @toggleLabelsTitles="toggleLabelsTitles"
          :isLabelsTitlesShown="isCardPreviewLabelsShown"
        ></card-preview>
      </draggable>
    </div>
    <card-compose :groupId="group.id" :boardId="board._id"></card-compose>
  </div>
</template>

<script>
import cardPreview from "@/cmps/card-preview";
import cardCompose from "@/cmps/card-compose";
import groupMenu from "@/cmps/group-menu";
import draggable from "vuedraggable";

export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
    board: {
      type: Object,
      required: true,
    },
    isCardPreviewLabelsShown: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    cardPreview,
    cardCompose,
    groupMenu,
    draggable,
  },
  data() {
    return {
      isGroupMenuOpen: false,
      lastTitleChar: ''
      // isLabelsTitlesShown: false
    };
  },
  methods: {
    removeGroup() {
      this.$emit("removeGroup", this.group.id);
    },
    toggleGroupMenu() {
      this.isGroupMenuOpen = !this.isGroupMenuOpen;
    },
    saveGroupTitle() {
      if (this.group.title === '') return this.group.title = this.lastTitleChar
      this.lastTitleChar = this.group.title
      this.updateBoard() 
    },
    updateBoard() {
      this.$emit("updateBoard", this.board);
    },
    toggleLabelsTitles() {
      // this.isLabelsTitlesShown = !this.isLabelsTitlesShown
      this.$emit("toggleLabelsTitles");
    },
  },
};
</script>


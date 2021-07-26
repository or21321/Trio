<template>
  <div class="group-list">
    <div class="group-header">
      <contenteditable
        :noHTML="true"
        :contenteditable="true"
        tag="h2"
        :noNL="false"
        type="text"
        v-if="isTitleEdit"
        class="group-title"
        v-model="group.title"
        @input="updateTitleDebounce"
        @blur="close"
        @focus="this.select()"
        ref="titleGroup"
      />
      <div v-else class="group-title-preview" @click="showTitleInput()">
        {{ group.title }}
      </div>
    </div>
    <span
      @click.stop="toggleGroupMenu"
      class="material-icons group-extras-menu"
    >
      more_horiz
    </span>
    <group-menu
      v-if="showGroupMenu"
      v-clickoutside="hidePopup"
      class="popup group-menu"
      :group="group"
      @closeGroupMenu="showGroupMenu = false"
      @removeGroup="removeGroup"
      @addCard="addCard"
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
          :darkWindow="darkWindow"
          :isLabelsTitlesShown="isCardPreviewLabelsShown"
          @socketUpdateBoard="socketUpdateBoard"
          @toggleLabelsTitles="toggleLabelsTitles"
          @updateCard="updateCard"
          @setToPreviewEdit="setToPreviewEdit"
          :loggedinUser="loggedinUser"
          ref="cardPreview"
        ></card-preview>
      </draggable>
    </div>
    <card-compose
      :groupId="group.id"
      :isAddCard="isAddCard"
      :boardId="board._id"
      @closeAddCard="isAddCard = false"
      @socketUpdateBoard="socketUpdateBoard"
      ref="cardCompose"
    >
    </card-compose>
  </div>
</template>

<script>
import cardPreview from "@/cmps/card-preview";
import cardCompose from "@/cmps/card-compose";
import groupMenu from "@/cmps/group-menu";
import draggable from "vuedraggable";
import { debounce } from "../services/util.service";

// import Vue from 'vue';

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
    darkWindow: {
      type: Boolean,
    },
    loggedinUser: {
      type: Object,
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
      lastTitleChar: "",
      isAddCard: false,
      showGroupMenu: false,
      isTitleEdit: false,
    };
  },
  created() {
    this.updateTitleDebounce = debounce(this.saveGroupTitle, 1000);
    
  },
  methods: {
  updateCard(card) {
    console.log('updateCard from group-list', card);
    this.$emit('updateCard', card, this.group.id)
  },
    close() {
      this.isTitleEdit = false;
    },
    async showTitleInput() {
      try {
        this.isTitleEdit = true;
        await setTimeout(() => {
          this.$refs.titleGroup.$el.focus();
        }, 100);
      } catch (err) {
        console.log("Error showing input", err);
      }
    },
    hidePopup() {
      this.showGroupMenu = false;
    },
    socketUpdateBoard() {
      this.$emit("socketUpdateBoard");
    },
    removeGroup() {
      this.$emit("removeGroup", this.group.id);
    },
    addCard() {
      this.isAddCard = true;
    },
    toggleGroupMenu() {
      this.showGroupMenu = !this.showGroupMenu;
    },
    async saveGroupTitle() {
      try {
        if (this.group.title === "")
          return (this.group.title = this.lastTitleChar);
        this.lastTitleChar = this.group.title;
        await this.updateBoard();
        this.isTitleEdit = false;
      } catch (err) {
        console.log("Had a problem updating group title", err);
      }
    },
    updateBoard() {
      this.$emit("updateBoard", this.board);
    },
    toggleLabelsTitles() {
      this.$emit("toggleLabelsTitles");
    },
    setToPreviewEdit(deff) {
      this.$emit("setToPreviewEdit", deff);
    },
  },
};
</script>


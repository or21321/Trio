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
        @input="updateTitleDebounce"
      />
      <!-- @click.exact.prevent -->
    </div>
    <span @click.stop="toggleGroupMenu" class="material-icons group-extras-menu">
      more_horiz
    </span>
    <group-menu
      v-if="showGroupMenu"
      v-clickoutside="hidePopup"
      class="popup"
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
          @updateCard="updateBoard"
          @setToPreviewEdit="setToPreviewEdit"
          :loggedinUser="loggedinUser"
        ></card-preview>
      </draggable>
    </div>
    <card-compose 
    :groupId="group.id" 
    :isAddCard="isAddCard"
    :boardId="board._id"
    @closeAddCard="isAddCard = false"
   @socketUpdateBoard="socketUpdateBoard">
    </card-compose>
  </div>
</template>

<script>
import cardPreview from "@/cmps/card-preview";
import cardCompose from "@/cmps/card-compose";
import groupMenu from "@/cmps/group-menu";
import draggable from "vuedraggable";
import {debounce} from '../services/util.service'

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
      isAddCard:false,
      showGroupMenu: false
    };
  },
  created(){
   this.updateTitleDebounce = debounce(this.saveGroupTitle,1000);
  },
  methods: {
    // updateCard() {
    // console.log("from group", { card, groupId: this.group.id });
    // this.$emit('updateCard', { card, groupId: this.group.id })
    //   this.$emit("updateBoard");
    // },
    hidePopup(){
      this.showGroupMenu = false;
    },  
    socketUpdateBoard() {
      this.$emit("socketUpdateBoard");
    },
    removeGroup() {
      this.$emit("removeGroup", this.group.id);
    },
    addCard(){
      this.isAddCard = true; 
    },
    toggleGroupMenu() {
       this.showGroupMenu = !this.showGroupMenu;
    },
    saveGroupTitle() {
      if (this.group.title === "")
        return (this.group.title = this.lastTitleChar);
      this.lastTitleChar = this.group.title;
      console.log(this.lastTitleChar);
      this.updateBoard();
    },
    updateBoard() {
      this.$emit("updateBoard", this.board);
    },
    toggleLabelsTitles() {
      // this.isLabelsTitlesShown = !this.isLabelsTitlesShown
      this.$emit("toggleLabelsTitles");
    },
    setToPreviewEdit(deff) {
      this.$emit("setToPreviewEdit", deff);
    },
  },
};
</script>


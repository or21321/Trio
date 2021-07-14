<template>
  <div v-if="isComposeOn" class="card-compose">
    <textarea
      v-model="cardToEdit.title"
      id=""
      cols="38"
      rows="3"
      placeholder="Enter a title for this card..."
    ></textarea>
    <div class="compose-features">
      <button @click="add">Add card</button>
      <button @click="toggleCompose" class="material-icons">close</button>
      <span
        @click="openGroupExtrasMenu"
        class="material-icons card-compose-options-btn"
      >
        more_horiz
      </span>
    </div>
  </div>
  <div @click="toggleCompose" v-else class="card-compose-btn">
    <span class="material-icons">add</span>
    Add a card
  </div>
</template>

<script>
import { boardService } from "@/services/board.service.js";

export default {
  props: {
    boardId: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      cardToEdit: boardService.getEmptyCard(),
      isComposeOn: false,
    };
  },
  created() {
    console.log("card-compose created!");
  },
  methods: {
    add() {
      console.log(this.groupId, this.boardId, this.cardToEdit.title);
      this.$store.dispatch({
        type: "saveCard",
        card: this.cardToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
      });
      this.cardToEdit = boardService.getEmptyCard();
      this.toggleCompose();
    },
    toggleCompose() {
      console.log("toggleCompose()");
      this.isComposeOn = !this.isComposeOn;
    },
  },
};
</script>


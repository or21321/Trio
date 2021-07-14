<template>
  <div v-if="isComposeOn" class="card-compose">
    <textarea
      v-model="cardToEdit.txt"
      id=""
      cols="38"
      rows="3"
      placeholder="Enter a title for this card..."
    ></textarea>
    <div class="compose-features">
      <button @click="add">Add card</button>
      <button @click="toggleCompose" class="material-icons">close</button>
    </div>
  </div>
  <div 
  @click=toggleCompose 
  v-else 
  class="card-compose-btn"
  >
    BTN
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
      isComposeOn: false
    };
  },
  created() {
    console.log("card-compose created!");
  },
  methods: {
    add() {
      console.log(this.groupId, this.boardId);
      // this.$emit("addCard");
    },
    toggleCompose() {
      console.log('toggleCompose()');
      this.isComposeOn = !this.isComposeOn
    }
  },
};
</script>


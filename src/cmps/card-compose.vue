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
        @click="openComposeOptions"
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
  methods: {
    async add() {
        var msg = {}
       try{
         this.toggleCompose();
         this.$store.dispatch({
            type: "saveCard",
            card: this.cardToEdit,
            groupId: this.groupId,
            boardId: this.boardId,
         });
         this.cardToEdit = boardService.getEmptyCard();
         msg = {
           txt:'Card was successfully added',
           type:'success'
        }
      } catch (err) {
           msg = {
           txt:'Fail add card, try again later',
           type:'error'
        }
        throw err;
      }finally{
         await this.$store.dispatch({type:'showMsg', msg})
      }
    },
    toggleCompose() {
      this.isComposeOn = !this.isComposeOn;
    },
    openComposeOptions() {  
      console.log('openComposeOptions()');
    }
  },
};
</script>


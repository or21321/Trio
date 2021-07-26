<template>
  <div v-if="isComposeOn" v-clickoutside="hideCompose" class="card-compose">
    <textarea
      ref="textarea"
      @keydown.enter="add"
      @keydown.enter.exact.prevent
      v-model="cardToEdit.title"
      cols="38"
      rows="3"
      placeholder="Enter a title for this card..."
    ></textarea>
    <div class="compose-features">
      <!-- <el-button type="primary" :disabled="!cardToEdit.title" @click="add" >Add card</el-button> -->
      <button class="compose-btn" @click="add" 
      :disabled="!cardToEdit.title" >Add card</button>
      <button @click="toggleCompose" class="material-icons">close</button>
    </div>
  </div>
  <div @click="toggleCompose" v-else class="card-compose-btn">
    <span class="material-icons">add</span>
    Add a card
  </div>
</template>

<script>
import { boardService } from "@/services/board.service.js";
import { eventBus } from "@/services/event-bus-service";

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
    isAddCard:{
        type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      cardToEdit: boardService.getEmptyCard(),
      isComposeOn: true,
    };
  },
  mounted() {
    this.isComposeOn = false;
  },
  watch: {
    isComposeOn: {
      handler() {
         if (this.isComposeOn)
          setTimeout(() => {
            this.$refs.textarea.focus();
          }, 100);
      },
    },
    isAddCard:{
       handler() {
          if(this.isAddCard){
            this.isComposeOn = true;
          }
      },
    }
  },
  methods: {
     hideCompose(ev){
        if(!ev.target.classList.contains('add-card-btn'))
            this.isComposeOn = false;
            this.$emit('closeAddCard')
     },
    async add() {
      var msg = {};
      const miniLoggedInUser = await this.$store.dispatch({
        type: "getMiniUser",
        userId: this.$store.getters.loggedinUser._id,
      });
      this.cardToEdit.byMember = miniLoggedInUser;
      try {
        // this.toggleCompose();
        const newCard = await this.$store.dispatch({
          type: "saveCard",
          card: this.cardToEdit,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        // this.toggleCompose()
        this.$emit('socketUpdateBoard')
        const group = await this.$store.dispatch({type: "getGroupById", groupId: this.groupId, boardId: this.boardId});
        const activity = { 
          txt: `added ${newCard.title} to ${group.title}`,
          card: { id: newCard.id, title: newCard.title }
          }
        this.cardToEdit = boardService.getEmptyCard();
          this.$refs.textarea.focus();
        msg = {
          txt: "Card was successfully added",
          type: "success",
        };
        eventBus.$emit("addActivity", activity)    
      } catch (err) {
        msg = {
          txt: "Fail to add card, try again later",
          type: "error",
        };
        throw err;
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    toggleCompose() {
      this.isComposeOn = !this.isComposeOn;
      if(!this.isComposeOn) this.$emit('closeAddCard')
    },
  },
};
</script>
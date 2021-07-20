<template>
  <div v-if="isComposeOn" class="card-compose">
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
      <button class="compose-btn" @click="add">Add card</button>
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
      isComposeOn: true,
      elCompose: null,
    };
  },
  mounted() {
    this.isComposeOn = false;
  },
  watch: {
    isComposeOn: {
      handler() {
        console.log(this.$refs);
        if (this.isComposeOn)
          setTimeout(() => {
            this.$refs.textarea.focus();
          }, 1);
      },
    },
  },
  methods: {
    async add() {
      var msg = {};
      const miniLoggedInUser = await this.$store.dispatch({
        type: "getMiniUser",
        userId: this.$store.getters.loggedinUser._id,
      });
      this.cardToEdit.byMember = miniLoggedInUser;
      try {
        // this.toggleCompose();
        this.$store.dispatch({
          type: "saveCard",
          card: this.cardToEdit,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        // this.toggleCompose()
        this.cardToEdit = boardService.getEmptyCard();
        setTimeout(() => {
          this.$refs.textarea.focus();
        }, 100);
        msg = {
          txt: "Card was successfully added",
          type: "success",
        };
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
    },
    openComposeOptions() {
      console.log("openComposeOptions()");
    },
  },
};
</script>


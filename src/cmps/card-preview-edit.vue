<template>
  <section class="card-preview-edit" @click.stop>
    <div class="main">
      <div
        class="cover"
        v-if="cardToEdit.cover.color"
        :style="{ backgroundColor: cardToEdit.cover.color }"
      ></div>
         <div class="card-labels" v-if="cardLabels.length && !isLabelsTitlesShown">
        <span
          class="label-preview"
          v-for="label in cardLabels"
          :key="label.id"
          :style="{ backgroundColor: label.color }"
          @click.stop="toggleLabelTitle">
        </span>
      </div>
      <div class="card-labels" v-else-if="cardLabels.length && isLabelsTitlesShown">
        <span
          class="label-preview title-shown"
          v-for="label in cardLabels"
          :key="label.id"
          :style="{ backgroundColor: label.color }"
          @click.stop="toggleLabelTitle"
          >{{ label.title }}</span
        >
      </div>
      
      <contenteditable
        class="main-textarea"
        tag="div"
        :contenteditable="true"
        v-model="cardToEdit.title"
        :noNL="false"
        :noHTML="true"
        @keypress.enter="saveCard"
      />

      <div class="info">
        <div class="card-badges">
          <div
            v-if="Object.keys(cardToEdit.dueDate).length"
            class="date-badge"
            :class="{ done: isCardDone }"
            @mouseover="dueDateHovered = true"
            @mouseleave="dueDateHovered = false"
          >
            <span
              v-if="dueDateHovered && isCardDone"
              class="material-icons-outlined badge-icon"
              @click.stop="toggleDueDateIsDone"
              >check_box</span
            >
            <span
              v-else-if="dueDateHovered && !isCardDone"
              class="material-icons-outlined badge-icon"
              @click.stop="toggleDueDateIsDone"
              >check_box_outline_blank</span
            >
            <span v-else class="material-icons-outlined badge-icon"
              >schedule</span
            >
            <span> {{ cardToEdit.dueDate.time | moment(" MMM d") }} </span>
          </div>

          <div v-if="cardToEdit.description" class="description-badge">
            <span class="material-icons-outlined badge-icon">subject</span>
          </div>

          <div v-if="cardToEdit.comments.length" class="comment-badge">
            <span class="material-icons-outlined badge-icon">
              mode_comment
            </span>
            <span>{{ cardToEdit.comments.length }}</span>
          </div>

          <div v-if="cardChecklistsTodos.length" class="checklist-badge">
            <span class="material-icons-outlined badge-icon">{{
              todosIcon
            }}</span>
            <span>
              <span>{{ checklistsDoneTodos }}</span>
              <span>/</span>
              <span>{{ cardChecklistsTodos.length }}</span>
            </span>
          </div>
        <ul class="card-members" v-if="cardToEdit.members.length">
          <!-- Todo: click on avatar open remove-confirm-popup -->
          <avatar
            class="hover-background"
            v-for="member in cardToEdit.members"
            :key="member.id"
            :username="member.fullname"
            :src="member.imgUrl"
            :size="28"
          />
        </ul>
        </div>
      </div>

      <el-button type="primary" class="save" @click="saveCard(true)">Save</el-button>
    </div>
    <nav>
      <button class="open-card" @click="openCard">
        <span class="icon material-icons-outlined">credit_card</span>
        Open card
      </button>
      <button class="open-card" @click="setCurrAction(actions[1])">
        <span class="icon material-icons-outlined">label</span>
        Edit labels
      </button>
      <button class="open-card" @click="setCurrAction(actions[2])">
        <span class="icon material-icons-outlined">watch_later</span>
        Edit dates
      </button>
      <button class="open-card" @click="setCurrAction(actions[3])">
        <span class="icon material-icons-outlined">wallpaper</span>
        Change cover
      </button>
      <button class="open-card" @click="setCurrAction(actions[0])">
        <span class="icon material-icons-outlined">person_add</span>
        Chenge members
      </button>
      <button class="open-card" @click="removeCard">
        <span class="icon material-icons-outlined">delete</span>
        Remove card
      </button>
    </nav>
    <component
      class="popup popup-component"
      v-if="currAction"
      :is="currAction.type"
      :card="cardToEdit"
      :action="currAction"
      @close="closeEditPopup"
      @updateCard="updateCard"
      @click.stop
    />
  </section>
</template>
<script>
import cardMembersEdit from "@/cmps/dynamic/card-members-edit";
import cardLabelsEdit from "@/cmps/dynamic/card-labels-edit";
import cardDatesEdit from "@/cmps/dynamic/card-dates-edit";
import cardCoverEdit from "@/cmps/dynamic/card-cover-edit";
import avatar from "vue-avatar";
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
    isLabelsTitlesShown: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    cardMembersEdit,
    cardLabelsEdit,
    cardDatesEdit,
    cardCoverEdit,
    avatar,
  },
  data() {
    return {
      cardToEdit: null,
      boardId: this.$route.params.boardId,
      cardChecklistsTodos: [],
      cardLabels: [],
      dueDateHovered: false,
      actions: [
        {
          type: "cardMembersEdit",
          icon: "person_add",
          name: "Members",
        },
        {
          type: "cardLabelsEdit",
          icon: "label",
          name: "Labels",
        },
        {
          type: "cardDatesEdit",
          icon: "watch_later",
          name: "Dates",
        },
        {
          type: "cardCoverEdit",
          icon: "wallpaper",
          name: "Cover",
        },
      ],
      currAction: null,
    };
  },
  created() {
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
  },
  watch: {
    "cardToEdit.labelIds": {
      deep: true,
      handler() {
        this.filterCardLabels();
      },
    },
    "cardToEdit.checklists": {
      deep: true,
      handler() {
        this.countCardTodos();
      },
    },
  },
  methods: {
    async saveCard(isSaveButton) {
      try {
        this.$store.dispatch({
          type: "saveCard",
          card: this.cardToEdit,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        if(isSaveButton) this.closeEdit();
      } catch (err) {
        console.log("ERROR : cannot save card ", this.cardToEdit, ",", err);
      }
    },
    closeEdit() {
      this.$emit("closeEdit");
    },
    openCard() {
      this.closeEdit();
      this.$router.push(
        `/b/${this.boardId}/g/${this.groupId}/c/${this.card.id}`
      );
    },
    async removeCard() {
      this.closeEdit();
      var msg = {};
      try {
        await this.$store.dispatch({
          type: "removeCard",
          cardId: this.card.id,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        msg = {
          txt: "Card was successfully removed",
          type: "success",
        };
      } catch (err) {
        msg = {
          txt: "Fail remove card, try again later",
          type: "error",
        };
        throw err;
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    closeEditPopup() {
      this.currAction = null;
    },
    setCurrAction(action) {
      this.currAction = action;
    },
    updateCard(newCard) {
      this.cardToEdit = newCard;
      this.saveCard();
    },
    countCardTodos() {
      this.checklistsDoneTodos = 0;
      this.cardChecklistsTodos = [];
      this.cardToEdit.checklists.forEach((cl) => {
        cl.todos.forEach((todo) => {
          if (todo.isDone) this.checklistsDoneTodos++;
          this.cardChecklistsTodos.push(todo);
        });
      });
    },
    toggleDueDateIsDone() {
      this.cardToEdit.dueDate.isDone = !this.cardToEdit.dueDate.isDone;
      this.saveCard();
    },
    filterCardLabels() {
      //  console.log('this.currBoard().labels', this.currBoard().labels)
      // console.log('this.cardToEdit.labelIds', this.cardToEdit.labelIds)
       this.cardLabels = this.cardToEdit.labelIds.reduce((acc, labelId) => {
        const cardLabel = this.currBoard().labels.find((label) => {
           console.log(label.id, '==' ,labelId);
          return label.id === labelId;
        });
        if (cardLabel) acc.push(cardLabel);
        else console.log("cardLabel undefined", cardLabel);
        return acc;
      }, []);
    },
    currBoard() {
      return this.$store.getters.currBoard;
    },
  },
  computed: {
    todosIcon() {
      return this.cardChecklistsTodos.length === this.checklistsDoneTodos &&
        this.checklistsDoneTodos
        ? "check_box"
        : "check_box_outline_blank";
    },
    isCardDone() {
      return this.cardToEdit.dueDate.isDone;
    },
  },
};
</script>

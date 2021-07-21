<template>
  <div @click="toCardDetails" class="card-preview">
    <div
      class="cover-half"
      v-if="card.cover.type === 'half'"
      :style="{ backgroundColor: card.cover.color }"
    >
      <button
        class="edit-btn"
        :class="{ 'is-cover': card.cover.color }"
        @click.stop="setToPreviewEdit($event,card, true)"
      >
        <span class="material-icons-outlined icon">edit</span>
      </button>
    </div>
    <div
      class="cover-full"
      v-if="card.cover.type === 'full'"
      :style="{ backgroundColor: card.cover.color }"
    >
      <button
        class="edit-btn"
        :class="{ 'is-cover': card.cover.color}"
        @click.stop="setToPreviewEdit($event,card, true)"
      >
        <span class="material-icons-outlined icon">edit</span>
      </button>
      <span class="card-preview-title">{{ card.title }}</span>
    </div>

    <section class="main-preview" v-if="card.cover.type !== 'full'">
      <button
        v-if="card.cover.type !== 'half'"
        class="edit-btn"
        :class="{ 'is-cover': card.cover.color , 'is-img-no-cover': (card.attachments.length >= 1 
        && !card.cover.color) }"
        @click.stop="setToPreviewEdit($event,card, true)"
      >
        <span class="material-icons-outlined icon">edit</span>
      </button>
      <img
        class="img-preview"
        v-if="card.attachments.length"
        :src="card.attachments[0].url"
      />
      <div class="card-labels" v-if="cardLabels && !isLabelsTitlesShown">
        <span
          class="label-preview"
          v-for="label in cardLabels"
          :key="label.id"
          :style="{ backgroundColor: label.color }"
          @click.stop="toggleLabelTitle"
        >
        </span>
        <!-- <span v-else class="label" v-for="label in cardLabels" :key="label.id" :style="{backgroundColor:label.color}">{{label.title}}</span> -->
      </div>
      <div class="card-labels" v-else>
        <!-- <span class="label-preview" v-for="label in cardLabels" :key="label.id" :style="{backgroundColor:label.color}"></span> -->
        <span
          class="label-preview title-shown"
          v-for="label in cardLabels"
          :key="label.id"
          :style="{ backgroundColor: label.color }"
          @click.stop="toggleLabelTitle"
          >{{ label.title }}</span
        >
      </div>
      <span class="card-preview-title">{{ card.title }}</span>
      <div class="card-info">
        <div class="card-badges">
          <div class="notifications-badge" v-if="userNotifications">
            <span class="material-icons-outlined badge-icon"
              >notifications</span
            >
            <span>{{ userNotifications }}</span>
          </div>

          <div
            v-if="Object.keys(card.dueDate).length"
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
            <span> {{ card.dueDate.time | moment(" MMM d") }} </span>
          </div>

          <!-- <div v-if="card.description !== '\n\n'" class="description-badge"> -->
          <div v-if="card.description" class="description-badge">
            <span class="material-icons-outlined badge-icon">subject</span>
          </div>

          <div v-if="card.comments.length" class="comment-badge">
            <span class="material-icons-outlined badge-icon">
              mode_comment
            </span>
            <span>{{ card.comments.length }}</span>
          </div>

            <div v-if="card.attachments.length" class="attachments-badge">
               <span class="material-icons-outlined badge-icon">
               attachments
               </span>
               <span>{{ card.attachments.length }}</span>
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
        </div>
        <ul class="card-members" v-if="card.members.length">
          <!-- Todo: click on avatar open remove-confirm-popup -->
          <avatar
            class="hover-background"
            v-for="member in card.members"
            :key="member.id"
            :username="member.fullname"
            :src="member.imgUrl"
            :size="28"
              color="#172b4d"
            backgroundColor="#dfe1e6"
          />
        </ul>
      </div>
    </section>
    <card-preview-edit
      v-if="cardEdit === cardToEdit && isEdit"
      :card="cardToEdit"
      :groupId="groupId"
      :isLabelsTitlesShown="isLabelsTitlesShown"
      @socketUpdateBoard="socketUpdateBoard"
      @closeEdit="setToPreviewEdit(null,false)"
    />
  </div>
</template>

<script>
import avatar from "vue-avatar";
import CardPreviewEdit from "./card-preview-edit";

export default {
  components: {
    avatar,
    CardPreviewEdit,
  },
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
    darkWindow: {
      type: Boolean,
    },
    loggedinUser: {
      type: Object,
    },
  },
  data() {
    return {
      cardLabels: [],
      cardChecklistsTodos: [],
      checklistsDoneTodos: 0,
      dueDateHovered: false,
      isEdit: false,
      cardToEdit: null,
      userNotifications: 0,
    };
  },
  watch: {
    "card.labelIds": {
      immediate: true,
      deep: true,
      handler() {
        this.filterCardLabels();
      },
    },
    "card.checklists": {
      immediate: true,
      deep: true,
      handler() {
        this.countCardTodos();
      },
    },
    "loggedinUser.mentions": {
      immediate: true,
      deep: true,
      handler() {
        console.log("MENTIONS!");
        this.countUserNotifications();
      },
    },  
    // isCardDone: {
    //   handler() {
    //     console.log("watcher from preview on isCardDone", this.isCardDone);
    //   },
    // },
    darkWindow: {
      handler() {
        this.isEdit = this.darkWindow;
      },
    },
  },
  methods: {
    countUserNotifications() {
      this.userNotifications = this.loggedinUser.mentions.reduce(
        (acc, mention) => {
          if (mention.cardId === this.card.id) acc++;
          return acc
        },
        0
      );
    },
    toggleDueDateIsDone() {
      this.card.dueDate.isDone = !this.card.dueDate.isDone;
      this.$emit("updateCard");
    },
    countCardTodos() {
      this.checklistsDoneTodos = 0;
      this.cardChecklistsTodos = [];
      this.card.checklists.forEach((cl) => {
        cl.todos.forEach((todo) => {
          if (todo.isDone) this.checklistsDoneTodos++;
          this.cardChecklistsTodos.push(todo);
        });
      });
    },
    filterCardLabels() {
      // this.cardLabels = [];
      this.cardLabels = this.card.labelIds.reduce((acc, labelId) => {
        const cardLabel = this.currBoard.labels.find((label) => {
          return label.id === labelId;
        });
        if (cardLabel) acc.push(cardLabel);
        else console.log("cardLabel undefined", cardLabel);
        return acc;
      }, []);
    },
    toCardDetails() {
      this.$router.push(
        `${this.$route.path}/g/${this.groupId}/c/${this.card.id}`
      );
    },
    toggleLabelTitle() {
      this.$emit("toggleLabelsTitles");
    },
    setToPreviewEdit(ev,card, deff) {
       console.log(ev);
      this.$emit("setToPreviewEdit", deff);
      this.cardToEdit = card;
      this.$store.commit({ type: "setCardEdit", card });
    },
    socketUpdateBoard(){
       this.$emit('socketUpdateBoard')
    }
  },
  computed: {
    cardEdit() {
      return this.$store.getters.cardEdit;
    },
    currBoard() {
      return this.$store.getters.currBoard;
    },
    todosIcon() {
      return this.cardChecklistsTodos.length === this.checklistsDoneTodos &&
        this.checklistsDoneTodos
        ? "check_box"
        : "check_box_outline_blank";
    },
    isCardDone() {
      return this.card.dueDate.isDone;
    },
  },
};
</script>

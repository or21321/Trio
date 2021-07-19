<template>
  <div @click="toCardDetails" class="card-preview">
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

        <div v-if="card.description !== '\n\n'" class="description-badge">
          <span class="material-icons-outlined badge-icon">subject</span>
        </div>

        <div v-if="card.comments.length" class="comment-badge">
          <span class="material-icons-outlined badge-icon"> mode_comment </span>
          <span>{{ card.comments.length }}</span>
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
        />
      </ul>
    </div>
  </div>
</template>

<script>
import avatar from "vue-avatar";

export default {
  components: {
    avatar,
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
  },
  data() {
    return {
      cardLabels: [],
      cardChecklistsTodos: [],
      checklistsDoneTodos: 0,
      dueDateHovered: false,
    };
  },
  watch: {
    "card.labelIds": {
      immediate: true,
      deep: true,
      handler() {
        console.log("watcher on card from preview", this.card);
        this.filterCardLabels();
      },
    },
    "card.checklists": {
      immediate: true,
      deep: true,
      handler() {
        console.log("watcher on card.checklists");
        this.countCardTodos();
      },
    },
    isCardDone: {
      handler() {
        console.log("watcher from preview on isCardDone", this.isCardDone);
      },
    },
  },
  computed: {
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

  methods: {
    toggleDueDateIsDone() {
      console.log("toggleDueDateIsDone()");
      // const cardToSave = JSON.parse(JSON.stringify(this.card));
      // cardToSave.dueDate.isDone = !cardToSave.dueDate.isDone;
      this.card.dueDate.isDone = !this.card.dueDate.isDone
      // this.$emit('updateCard', {card: cardToSave})
      this.$emit('updateCard')
    },
    countCardTodos() {
      console.log("countCardTodos", this.cardChecklistsTodos);
      this.checklistsDoneTodos = 0;
      this.cardChecklistsTodos = [];
      this.card.checklists.forEach((cl) => {
        console.log("cl", cl);
        cl.todos.forEach((todo) => {
          if (todo.isDone) this.checklistsDoneTodos++;
          this.cardChecklistsTodos.push(todo);
        });
      });
      console.log("cardChecklistsTodos", this.cardChecklistsTodos);
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
      console.log("cardLabels from preview", this.cardLabels);
    },
    toCardDetails() {
      this.$router.push(
        `${this.$route.path}/g/${this.groupId}/c/${this.card.id}`
      );
    },
    toggleLabelTitle() {
      this.$emit("toggleLabelsTitles");
    },
  },
};
</script>

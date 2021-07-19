<template>
  <div @click="toCardDetails" class="card-preview">
     <button class="edit-btn" @click.stop="setToPreviewEdit">
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
        <div v-if="cardChecklistsTodos.length" class="checklist-badge">
          <span class="material-icons-outlined">{{todosIcon}}</span>
          <span>{{ checklistsDoneTodos }}</span
          >/
          <span>{{ cardChecklistsTodos.length }}</span>
        </div>
        <!-- <div
          v-if="cardChecklistsTodos.length === checklistsDoneTodos"
          class="checklist-badge"
        >
          <span class="material-icons-outlined">check_box</span>
          <span>{{ checklistsDoneTodos }}</span
          >/
          <span>{{ cardChecklistsTodos.length }}</span>
        </div> -->
        <div v-if="card.comments.length" class="comment-badge">
          <span class="material-icons-outlined badge-icon">
            chat_bubble_outline
          </span>
          <span>{{ card.comments.length }}</span>
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
    };
  },
  watch: {
    card: {
      immediate: true,
      handler() {
        console.log("watcher on card from preview", this.card);
        this.filterCardLabels();
        this.countCardTodos();
      },
    },
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    todosIcon() { 
      return (this.cardChecklistsTodos.length === this.checklistsDoneTodos && this.checklistsDoneTodos)?  'check_box_outlined_blank': 'check_box' 
    },
  },

  methods: {
    countCardTodos() {
      console.log("cardChecklistsTodos", this.cardChecklistsTodos);
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
      console.log("checklistsDoneTodos", this.checklistsDoneTodos);
    },
    filterCardLabels() {
      console.log("watch from preview, handler on card", this.card);
      this.cardLabels = [];
      this.card.labelIds.forEach((labelId) => {
        const cardLabel = this.currBoard.labels.find((label) => {
          // console.log(label.id === labelId);
          // console.log('label.id', label.id);
          // console.log('labelId', labelId);
          return label.id === labelId;
        });
        if (cardLabel) return this.cardLabels.push(cardLabel);
        else console.log("cardLabel undefined", cardLabel);
      });
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
    setToPreviewEdit(){
       this.$emit('setToPreviewEdit')
    }
  },
};
</script>

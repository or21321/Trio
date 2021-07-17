<template>
  <section>
    <div class="card-edit-header">
      <span>{{ action.name }}</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>

    <div class="card-edit-main">
      <input type="text" placeholder="Search labels" />
      <ul class="popup-list-layout-1">
        <h4>LABELS</h4>
        <li
          class="card-label-preview"
          v-for="label in currBoardLabels"
          :key="label.id"
        >
          <span :style="{ backgroundColor: label.color }">{{
            label.title
          }}</span>
          <span class="material-icons-outlined">edit</span>
        </li>
      </ul>
      <div>
        <button class="popup-btn-1">Create a new label</button>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  props: {
    action: {
      type: Object,
      required: true,
    },
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cardToEdit: null,
    };
  },
  created() {
    console.log("cardLabelsEdit creadted!");
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
    console.log("cardToEdit", this.cardToEdit);
    console.log("board for labels", this.$store.getters.currBoard);
  },
  computed: {
    currBoardLabels() {
      return this.$store.getters.currBoard.labels;
    },
  },
  methods: {
    updateCard() {
      this.$emit("updateCard", this.card);
    },
    created() {
      this.cardToEdit = JSON.parse(JSON.stringify(this.card));
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

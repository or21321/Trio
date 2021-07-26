<template>
  <section v-if="!labelToEdit">
    <div class="card-edit-header">
      <span>{{ action.name }}</span>
            <span class="close material-icons close-popup-btn" @click.stop="close">close</span>
    </div>

    <div class="card-edit-main">
      <!-- <input type="text" placeholder="Search labels" v-model="filterBy" /> -->
      <ul class="popup-list-layout-1">
        <h4>LABELS</h4>
        <li
          @click="toggleLabelOnCard(label)"
          class="card-label-preview"
          v-for="label in currBoard.labels"
          :key="label.id"
        >
          <span :style="{ backgroundColor: label.color }">{{
            label.title
          }}</span>
          <span
            @click.stop="setLabelToEdit(label)"
            class="material-icons-outlined icon"
            >edit</span
          >
        </li>
      </ul>
      <div>
        <button @click.stop="setLabelToEdit(emptyLabel)" class="popup-btn-1">
          Create a new label
        </button>
      </div>
    </div>
  </section>

  <section v-else>
    <div class="card-edit-header">
      <span>Change label</span>
      <span @click.stop="back" class="material-icons-outlined back">
        arrow_back_ios
      </span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>

    <div class="card-edit-main">
      <h4>Name</h4>
      <input type="text" v-model="labelToEdit.title" />
      <h4>Select a color</h4>
      <ul class="popup-list-layout-2">
        <li
          @click="setLabelColor(color)"
          class="edit-label-color-preview"
          v-for="color in colorsForNewLabel"
          :key="color"
          :style="{ backgroundColor: color }"
        >
          <span
            v-if="color === labelToEdit.color"
            class="material-icons-outlined checked-color-icon"
            >check</span
          >
          <!-- <span :style="{ backgroundColor: label.color }">{{
            label.title
          }}</span>
          <span @click.stop="toggleEdit" class="material-icons-outlined"
            >edit</span
          > -->
        </li>
        <div class="edit-labels-no-color-section">
          <li
            @click="setLabelColor('#b3bac5')"
            class="edit-label-color-preview no-color"
            :style="{ backgroundColor: '#b3bac5' }"
          >
            <span
              v-if="'#b3bac5' === labelToEdit.color"
              class="material-icons-outlined checked-color-icon"
              >check</span
            >
          </li>
          <p>No color.</p>
          <p>This won't show up on the front of cards.</p>
        </div>
      </ul>
      <div class="edit-btns">
        <el-button @click="saveLabel" type="primary" class="save-btn"
          >Save</el-button
        >
        <el-button @click="removeLabel" type="danger" class="remove-btn"
          >Delete</el-button
        >
        <!-- <el-button type="success">save</el-button>
        <el-button type="roaming">save</el-button>
        <el-button type="primary">save</el-button> -->
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
      filterBy: "",
      boardToEdit: null,
      cardToEdit: null,
      labelToEdit: null,
      colorsForNewLabel: [
        "#61bd4f",
        "#f2d600",
        "#ff9f1a",
        "#eb5a46",
        "#c377e0",
        "#0079bf",
        "#00c2e0",
        "#51e898",
        "#ff78cb",
        "#344563",
      ],
      emptyLabel: {
        color: "#61bd4f",
        title: null,
        id: null,
      },
    };
  },
  async created() {
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
  },
  watch: {
    'currBoard': {
      immediate: true,
      handler() {
        this.boardToEdit = JSON.parse(JSON.stringify(this.currBoard));
      },
    },
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
  },
  methods: {
    setLabelColor(color) {

      this.labelToEdit.color = color;
    },
    toggleLabelOnCard(label) {
      const isLabelOnCardIdx = this.cardToEdit.labelIds.findIndex((labelId) => {
        return labelId === label.id;
      });
      if (isLabelOnCardIdx === -1) {
        this.cardToEdit.labelIds.push(label.id);
      } else {
        this.cardToEdit.labelIds.splice(isLabelOnCardIdx, 1);
        this.updateCard();
      }
      this.updateCard(this.cardToEdit);
    },
    updateCard() {
      this.$emit("updateCard", this.cardToEdit,true);
    },
    close() {
      this.$emit("close");
    },
    back() {
      this.labelToEdit = null;
    },
    async saveLabel() {
      try {
        if (this.labelToEdit.id) {
          const idx = this.boardToEdit.labels.findIndex(
            (label) => label.id === this.labelToEdit.id
          );
          this.boardToEdit.labels.splice(idx, 1, this.labelToEdit);
          await this.$store.dispatch({
            type: "saveBoard",
            board: this.boardToEdit,
          });
          this.labelToEdit = null;
          this.emptyLabel = { color: "", id: "", title: "" };
        } else {
          this.labelToEdit.id = Date.now() % 1000 +'';
          this.boardToEdit.labels.push(this.labelToEdit);
          await this.$store.dispatch({
            type: "saveBoard",
            board: this.boardToEdit,
          });
          this.labelToEdit = null;
          this.emptyLabel = { color: "", id: "", title: "" };
        }
      } catch (err) {
        console.log("Error saving label to board:", err);
      }
    },
    async removeLabel() {
      try {
        // Maybe remove this if
        if (this.labelToEdit.id) {
          const idx = this.boardToEdit.labels.findIndex(
            (label) => label.id === this.labelToEdit.id
          );
          this.boardToEdit.labels.splice(idx, 1);
          await this.$store.dispatch({
            type: "saveBoard",
            board: this.boardToEdit,
          });
          this.labelToEdit = null;
        }
      } catch (err) {
        console.log("Error saving label to board:", err);
      }
    },
    setLabelToEdit(label) {
      this.labelToEdit = label;
    },
  },
};
</script>

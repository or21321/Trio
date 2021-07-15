<template>
  <div class="board-header">
    <!-- <input
      class="board-header-btn"
      v-model="boardTitle"
      @change="updateTitle"
      contenteditable
      @focus="$event.target.select()"
    /> -->
    <h1 class="board-header-btn">
      <!-- <span class="material-icons">dashboard</span>
      <span class="">{{ title }}</span>
      <span class="material-icons">keyboard_arrow_down</span> -->
      {{ title }}
    </h1>
    <span
      class="material-icons board-header-btn star"
      @click="toggleStar"
      :class="selected"
      >star_border</span
    >
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    star: {
      type: Boolean,
      required: true,
    },
  },
  // data() {
  //   return {
  //     boardTitle: null,
  //   };
  // },
  computed: {
    selected() {
      return { selected: this.star };
    },
  },
  // created() {
  //   this.boardTitle = JSON.parse(JSON.stringify(this.title));
  // },
  methods: {
    toggleStar() {
      this.$emit("toggleStar");
    },
    // updateTitle() {
    //   this.$emit("updateTitle", this.boardTitle);
    // },
  },
};
</script>
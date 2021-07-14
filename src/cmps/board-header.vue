<template>
  <div class="board-header">
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
  computed: {
    selected() {
      return { selected: this.star };
    },
  },
  methods: {
    toggleStar() {
      this.$emit("toggleStar");
    },
  },
};
</script>
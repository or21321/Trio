<template>
  <div class="board-header">
    <contenteditable
      v-if="isEditing"
      class="board-header-btn"
      tag="span"
      :contenteditable="true"
      v-model="boardTitle"
      :noNL="false"
      :noHTML="true"
      @="updateTitle"
      @keypress.enter="updateTitle"
      ref="header"
    />
    <h1 v-else class="board-header-btn" @click="isEditing = !isEditing">
      {{ boardTitle }}
    </h1>
    <!-- <span class="material-icons">dashboard</span>
      <span class="">{{ title }}</span>
      <span class="material-icons">keyboard_arrow_down</span> -->
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
  data() {
    return {
      boardTitle: null,
      isEditing: true,
    };
  },
  computed: {
    selected() {
      return { selected: this.star };
    },
  },
  watch:{
     "title": {
        immediate: true,
         handler() {
            this.boardTitle = JSON.parse(JSON.stringify(this.title));
         }
     }
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.$refs.header.$el);
      this.$refs.header.$el.addEventListener("focusout", this.updateTitle);
      // console.log(this.$refs.header);
      this.isEditing = false;
    }, 1);
  },
  methods: {
    toggleStar() {
      this.$emit("toggleStar");
    },
    updateTitle() {
      console.log('updating')
      // this.boardTitle = ev.target.textContent
      this.isEditing = !this.isEditing;
      this.$emit("updateTitle", this.boardTitle);
    },
  },
};
</script>
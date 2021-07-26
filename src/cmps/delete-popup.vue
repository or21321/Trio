<template>
  <section class="delete-popup popup">
    <div class="header">
      <h1>Delete board?</h1>
      <span class="close material-icons close-popup-btn" @click.stop="close"
        >close</span
      >
    </div>

    <main>
      <p>Delete a board is permanent. There is no undo.</p>
      <button class="remove-btn" @click="removeBoard">Delete</button>
    </main>
  </section>
</template>

<script>
export default {
  methods: {
    removeBoard() {
      this.$emit("removeBoard");
      this.setDarkWindow(false);
    },
    close() {
      this.$emit("close");
      this.setDarkWindow(false);
    },
    setDarkWindow(deff) {
      this.$emit("setDarkWindow", 'deleteBoard',deff);
    },
  },
};
</script>

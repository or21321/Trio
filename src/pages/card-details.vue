<template>
  <section class="card-details">
    <main class="card-container">
      <header class="header">Header</header>
      <section class="main">{{card}}</section>
      <nav class="nav">Nav</nav>
    </main>
  </section>
</template>

<script>
export default {
  data() {
    return {
      card: null,
    };
  },
  created() {
    console.log("card details is opened");
  },
  watch: {
    "$route.params.cardId": {
      immediate: true,
      async handler() {
        try {
          const { cardId } = this.$route.params;
          const { groupId } = this.$route.params;
          const { boardId } = this.$route.params;
          this.card = await this.$store.dispatch({
            type: "getCardById",
            cardId,
            groupId,
            boardId,
          });
        } catch (err) {
          console.log("cannot get card", err);
          throw err;
        }
      },
    },
  },
};
</script>

<style>
</style>
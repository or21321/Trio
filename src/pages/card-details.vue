<template>
  <section class="card-details" @click="closeCardDetails">
    <main class="card-container" @click.stop="" v-if="card">
      <header class="header">
        <span class="icon-title material-icons-outlined">title</span>
        <section class="titles">
          <input v-model="card.title" class="main-title" @change="saveCard" />
          <h4 class="sub-title">in list {{ groupName }}</h4>
        </section>
        <span class="close material-icons" @click="closeCardDetails">
          close
        </span>
      </header>
      <section class="main">
        <section class="description">
          <span class="material-icons-outlined">subject</span>
          <h1 class="title-description">Description</h1>
          <div
            class="description-text"
            contenteditable
            placeholder="Add a more detailed description..."
          ></div>
        </section>
      </section>
      <nav class="nav">
        <h3 class="title">Add to card</h3>
        <button @click="setPopup('Members')">
          <span class="material-icons-outlined">person_add</span>
          <span> Members </span>
        </button>
        <button @click="setPopup('Labels')">
          <span class="material-icons-outlined">label</span>
          <span> Labels </span>
        </button>
        <button @click="setPopup('Checklist')">
          <span class="material-icons-outlined">check_box</span>
          <span> Checklist </span>
        </button>
        <button @click="setPopup('Dates')">
          <span class="material-icons-outlined">watch_later</span>
          <span> Dates </span>
        </button>
        <button @click="setPopup('Attachment')">
          <span class="attachment material-icons-outlined">attachment</span>
          <span> Attachment </span>
        </button>
        <button @click="setPopup('Cover')">
          <span class="material-icons-outlined">wallpaper</span>
          <span> Cover </span>
        </button>
      </nav>
    </main>
  </section>
</template>

<script>
export default {
  data() {
    return {
      card: null,
      boardId: this.$route.params.boardId,
      groupId: this.$route.params.groupId,
      cardId: this.$route.params.cardId,
      groupName: null,
    };
  },
  watch: {
    "$route.params.cardId": {
      immediate: true,
      async handler() {
        try {
          this.card = await this.$store.dispatch({
            type: "getCardById",
            cardId: this.cardId,
            groupId: this.groupId,
            boardId: this.boardId,
          });
        } catch (err) {
          console.log("cannot get card", err);
          throw err;
        }
      },
    },
  },
  async created() {
    try {
      const group = await this.$store.dispatch({
        type: "getGroupById",
        groupId: this.groupId,
        boardId: this.boardId,
      });
      this.groupName = group.title;
    } catch (err) {
      console.log("cannot get group", err);
      throw err;
    }
  },
  methods: {
    closeCardDetails() {
      this.$router.push(`/b/${this.boardId}`);
    },
    setPopup() {},
    async saveCard() {
      try {
       this.card = await this.$store.dispatch({
          type: "saveCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });

      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      }
    },
  },
  computed: {},
};
</script>

<style>
</style>
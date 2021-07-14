<template>
  <div @click="toCardDetails" class="card-preview">
<<<<<<< HEAD
    <p>Title: {{ card.title }}</p>
=======
    <span class="card-preview-title">Title: {{ card.title }}</span>
>>>>>>> 8e718692dce3c82c347249cf004966cb10f0146b
    <p>Id: {{ card.id }}</p>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
<<<<<<< HEAD
    groupId: {
      type: String,
      required: true,
    },
  },
  methods: {
    toCardDetails() {
      this.$router.push(`${this.$route.path}/g/${this.groupId}/c/${this.card.id}`);
    },
  },
=======
  },
  methods: {
    toCardDetails() {
      console.log("toCardDetails(), card.id", this.card.id);
    },
  },
>>>>>>> 8e718692dce3c82c347249cf004966cb10f0146b
};
</script>

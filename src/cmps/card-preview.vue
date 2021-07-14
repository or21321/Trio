<template>
  <div @click="toCardDetails" class="card-preview">
    <span class="card-preview-title">Title: {{ card.title }}</span>
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
  },
  methods: {
    toCardDetails() {
      console.log("toCardDetails(), card.id", this.card.id);
    },
  },
};
</script>

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
      required: true

    },
    groupId: {
      type: String,
      required: true
    }
  },
  methods: {
    toCardDetails() {
      this.$router.push(`${this.$route.path}/g/${this.groupId}/c/${this.card.id}`);
    },
  },
};
</script>

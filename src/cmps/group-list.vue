<template>
  <div class="group-list">
    <div class="group-header">
      <h2>{{ group.title }}</h2>
    </div>
    <span class="material-icons group-extras-menu"> more_horiz </span>
    <div class="card-preview-container">
      <card-preview
        v-for="card in group.cards"
        :key="card.id"
        :card="card"
        :groupId="group.id"
      ></card-preview>
    </div>
  </div>
</template>

<script>
import cardPreview from "@/cmps/card-preview";

export default {
  props: {
    group: {
      type: Object,
      require: true,
    },
  },
  components: {
    cardPreview,
  },
};
</script>


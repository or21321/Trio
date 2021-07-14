<template>
  <div class="group-list">
<<<<<<< HEAD
      <card-preview v-for="card in group.tasks" :key="card.id" :groupId="group.id" :card="card"></card-preview>
=======
    <div class="group-header">
      <h2>{{ group.title }}</h2>
    </div>
    <span class="material-icons group-extras-menu"> more_horiz </span>
    <div class="card-preview-container">
      <card-preview
        v-for="card in group.tasks"
        :key="card.id"
        :card="card"
      ></card-preview>
    </div>
>>>>>>> 8e718692dce3c82c347249cf004966cb10f0146b
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


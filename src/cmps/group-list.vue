<template>
  <div class="group-list">
    <div class="group-header">
      <h2>{{ group.title }}</h2>
    </div>
    <span @click="openGroupExtrasMenu" class="material-icons group-extras-menu">
      more_horiz
    </span>
    <div class="card-preview-list">
      <card-preview
        v-for="card in group.tasks"
        :key="card.id"
        :card="card"
      ></card-preview>
    </div>
      <card-compose 
      :groupId="group.id"
      :boardId="boardId"
      ></card-compose>
  </div>
</template>

<script>
import cardPreview from "@/cmps/card-preview"
import cardCompose from "@/cmps/card-compose"

export default {
  props: {
    group: {
      type: Object,
      require: true,
    },
    boardId: {
      type: String,
      require: true,
    },
  },
  components: {
    cardPreview,
    cardCompose
  },
  created() {
    console.log("group-list created, groupId", this.group.id);
    console.log("group-list created, boardId", this.boardId);
  },
  methods: {
    openGroupExtrasMenu() {
      console.log("openGroupExtrasMenu()");
    },
  },
};
</script>


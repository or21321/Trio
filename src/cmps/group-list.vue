<template>
  <div class="group-list">
    <div class="group-header">
      <h2>{{ group.title }}</h2>
    </div>
    <span
      @click="isGroupMenuOpen = true"
      class="material-icons group-extras-menu"
    >
      more_horiz
    </span>
    <group-menu
      class="popup"
      :group="group"
      v-if="isGroupMenuOpen"
      @closeGroupMenu="isGroupMenuOpen = false"
      @removeGroup="removeGroup"
    />
    <div class="card-preview-list">
      <draggable
        :list="group.cards"
        :animation="200"
        ghost-class="ghost-card"
        group="cards"
      >
        <card-preview
          v-for="card in group.cards"
          :key="card.id"
          :card="card"
          :groupId="group.id"
        ></card-preview>
      </draggable>
    </div>
    <card-compose :groupId="group.id" :boardId="boardId"></card-compose>
  </div>
</template>

<script>
import cardPreview from "@/cmps/card-preview";
import cardCompose from "@/cmps/card-compose";
import groupMenu from "@/cmps/group-menu";
import draggable from "vuedraggable";

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
    cardCompose,
    groupMenu,
    draggable,
  },
  data() {
    return {
      isGroupMenuOpen: false,
    };
  },
  created() {
    console.log("group-list created, groupId", this.group.id);
    console.log("group-list created, boardId", this.boardId);
  },
  methods: {
    removeGroup() {
      this.$emit("removeGroup", this.group.id);
    },
  },
};
</script>


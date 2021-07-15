<template>
  <div v-if="isComposeOn" class="group-compose">
    <!-- <div> -->
    <!-- <textarea
      v-model="groupToCompose.title"
      id=""
      cols="38"
      rows="3"
      placeholder="Enter list title..."
    ></textarea> -->
    <input
      type="text"
      v-model="groupToCompose.title"
      placeholder="Enter list title..."
    />
    <!-- </div> -->
    <div class="compose-features">
      <button @click="add">Add list</button>
      <button @click="toggleCompose" class="material-icons">close</button>
    </div>
  </div>
  <div v-else @click="toggleCompose" class="group-compose-btn">
    <span class="group-compose-btn-content btn-container"
      ><span class="material-icons">add</span>Add another list
    </span>
  </div>
</template>

<script>
import { boardService } from "@/services/board.service.js";

export default {
  props: {
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      groupToCompose: boardService.getEmptyGroup(),
      isComposeOn: false,
    };
  },
  methods: {
    async add() {
      try {
        if (!this.groupToCompose.title) return;
        console.log("add()", this.boardId, this.groupToCompose);
        await this.$store.dispatch({
          type: "saveGroup",
          group: this.groupToCompose,
          boardId: this.boardId,
        });
        this.groupToCompose = boardService.getEmptyGroup();
        this.toggleCompose();
      } catch (err) {
        console.log("Err", err);
      }
    },
    toggleCompose() {
      this.isComposeOn = !this.isComposeOn;
    },
  },
};
</script>


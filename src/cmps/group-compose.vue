<template>
  <div v-if="isComposeOn" class="group-compose">
    <input
      type="text"
      v-model="groupToCompose.title"
      placeholder="Enter list title..."
      @keyup.enter="add"
      @keydown.enter.exact.prevent
      ref="titleInput"
    />
    <!-- </div> -->
    <div class="compose-features">
      <button
        @click="add"
        :disabled="!groupToCompose.title"
        class="compose-btn"
      >
        Add list
      </button>
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
import { eventBus } from "@/services/event-bus-service.js";

export default {
  props: {
    boardId: {
      type: String,
      required: true,
    },
    isBoardEmpty: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    if (this.isBoardEmpty) {
      this.isComposeOn = true;
    }
  },
  data() {
    return {
      groupToCompose: boardService.getEmptyGroup(),
      isComposeOn: false,
    };
  },
  watch: {
    'isComposeOn': {
      immediate: true,
      handler() {
        if (this.isComposeOn)
          setTimeout(() => {
            this.$refs.titleInput.focus();
          }, 1);
      },
    },
  },
  methods: {
    async add() {
      try {
        var msg = {};
        if (!this.groupToCompose.title) return;
        await this.$store.dispatch({
          type: "saveGroup",
          group: this.groupToCompose,
          boardId: this.boardId,
        });
        const activity = { txt: `added ${this.groupToCompose.title} to this board` }
        eventBus.$emit("addActivity", activity)
        this.$emit("socketUpdateBoard");
        this.groupToCompose = boardService.getEmptyGroup();
        setTimeout(() => {
          this.$refs.titleInput.focus();
        }, 100);
        msg = {
          txt: "List was successfully added",
          type: "success",
        };
      } catch (err) {
        msg = {
          txt: "Fail to add list, try again later",
          type: "error",
        };
        throw err;
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    toggleCompose() {
      this.isComposeOn = !this.isComposeOn;
    },
  },
};
</script>
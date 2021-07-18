<template>
  <div v-if="isComposeOn" class="group-compose">
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
         var msg = {};
        if (!this.groupToCompose.title) return;
            await this.$store.dispatch({
               type: "saveGroup",
               group: this.groupToCompose,
               boardId: this.boardId,
            });
            this.groupToCompose = boardService.getEmptyGroup();
            this.toggleCompose();
            msg = {
            txt:'List was successfully added',
            type:'success'
         }
      } catch (err) {
           msg = {
           txt:'Fail to add list, try again later',
           type:'error'
        }
        throw err;
      }finally{
         await this.$store.dispatch({type:'showMsg', msg})
      }
    },
    toggleCompose() {
      this.isComposeOn = !this.isComposeOn;
    },
  },
};
</script>


<template>
  <section class="card-checklist-edit">
    <div class="card-edit-header">
      <span>Add checklist</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <div class="card-edit-main">
       <span class="title">Title</span>
      <input type="text" ref="checklist" v-model="checklistTitle"
       placeholder="Checklist"/>
        <el-button type="primary" class="add-checklist"
        :disabled="!checklistTitle" @click="updateTask" >Add</el-button>
    </div>
  </section>
</template>

<script>
import { utilService } from '../../services/util.service';
export default {
  props: {
    action: {
      type: Object,
      required: true,
    },
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cardToEdit: null,
      checklistTitle:'Checklist'
    };
  },
  mounted() {
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
   this.$refs.checklist.select()
  },
  methods: {
    updateTask() {
       const checklist = {
          id:utilService.makeId(),
          title:this.checklistTitle,
          todos:[]
       }
       this.cardToEdit.checklists.push(checklist)
      this.$emit("updateCard", this.cardToEdit);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

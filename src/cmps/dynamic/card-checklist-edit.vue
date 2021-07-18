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
        <el-button type="primary"
         class="compose-btn" >Create board</el-button>
    </div>
  </section>
</template>

<script>
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
      // cardToEdit: null,
      checklistTitle:'Checklist'
    };
  },
  mounted() {
   //  this.cardToEdit = JSON.parse(JSON.stringify(this.card));
   this.$refs.checklist.select()
  },
  methods: {
    updateTask() {
      this.$emit("updateTask", this.card);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

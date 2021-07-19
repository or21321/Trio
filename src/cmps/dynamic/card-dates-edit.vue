<template>
  <section class="card-dates-edit">
    <div class="title">
      <span>{{ action.name }}</span>
        <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <main>
      <date-picker v-model="cardToEdit.dueDate.time" :inline="true" :default-value="new Date()" valueType="format"
      :time-picker-options="{start: '08:00',step: '00:30',end: '20:00',}">
      </date-picker>
         <el-button type="primary" class="save" 
         :disabled="!cardToEdit.dueDate.time"
         @click="updateCard">Save</el-button>
   </main>
  </section>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
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
    };
  },
  components: {
    DatePicker,
  },
  created() {
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
  },
  methods: {
    updateCard() {
       this.cardToEdit.dueDate.isDone = false;
      this.$emit("updateCard", this.cardToEdit);
      this.close();
    },
    close() {
      this.$emit("close");
    },
    getDate(value){
       console.log(value);
       const today = new Date(Date.now())
       return new Date(+today + value)
      //  return value;
    }
  },
};
</script>

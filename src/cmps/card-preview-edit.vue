<template>
   <section class="card-preview-edit">
      <div class="main">
          <contenteditable
        class="main-textarea"
        tag="div"
        :contenteditable="true"
        v-model="cardToEdit.title"
        :noNL="false"
        :noHTML="true"
        @keypress.enter="saveCard"
        @click.stop
      />
       <el-button type="primary" class="save" @click.stop="saveCard">Save</el-button>
      </div>
      <nav>
         <button class="open-card">Open card</button>
         <button class="open-card">Edit labels</button>
         <button class="open-card">Edit dates</button>
         <button class="open-card">Change cover</button>
         <button class="open-card">Chenge members</button>
         <button class="open-card">Remove card</button>
      </nav>

   </section>
</template>
<script>
export default {
   props:{
      card:{
         type:Object,
         required: true,
      },
      groupId:{
         type:String,
         required: true,
      }
   },
   data(){
      return{
         cardToEdit:null,
         boardId:this.$route.params.boardId
      }
   },
   created(){
      this.cardToEdit = JSON.parse(JSON.stringify(this.card));
   },
   methods:{
      saveCard(){
         this.$store.dispatch({type:'saveCard', card:this.cardToEdit,groupId:this.groupId,
         boardId:this.boardId})
         this.closeEdit();
      },
      closeEdit(){
         this.$emit('closeEdit')
      }
   }
}
</script>

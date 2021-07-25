<template>
  <section class="group-menu">
     
      <div class="card-edit-header">
        <span>List actions</span>
        <span class="close material-icons-outlined close-popup-btn" @click.stop="close">close</span>
      </div>
      <div class="card-edit-main">
          <button @click="addCard" class="add-card-btn">Add card...</button>
          <button @click="removeGroup">Delete list</button>
      </div>
  </section>
</template>


<script>
export default {
   props:{
      group:{
         type:Object,
         required:true
      }
   },
   watch:{
      'window.target':{
         handle(ev){
            console.log('ev', ev)
         }
      }
   },
   methods:{
      close(){
         this.$emit('closeGroupMenu')
      },
      removeGroup(){
           this.$emit('removeGroup')
      },
      addCard(){
           this.$emit('addCard')
           this.close();
      },
     
   }

}
</script>

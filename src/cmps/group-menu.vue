<template>
  <section class="group-menu">
     
      <div class="card-edit-header">
        <span>List actions</span>
        <span @click.stop="close" class="close-popup-btn">X</span>
      </div>
      <div class="card-edit-main">
         
          <button @click="removeGroup">Remove list...</button>
      </div>
  </section>
</template>


<script>
export default {
   props:{
      group:{
         type:Object,
         require:true
      }
   },
   methods:{
      close(){
         this.$emit('closeGroupMenu')
      },
      removeGroup(){
           this.$emit('removeGroup')
      }
   }

}
</script>

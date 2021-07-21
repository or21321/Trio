<template>
  <section class="boards-page">
     hey
      <ul>
         <li v-for="board in boards" :key="board._id">
            {{board.title}}
         </li>
      </ul>
  </section>
</template>

<script>
export default {
   data(){
      return{
         
      }
   },
  async created() {
     if(!this.boards){
         try {
            await this.$store.dispatch({ type: "loadBoards" });
         } catch (err) {
            console.log("ERROR cannot load boards");
         }
     }
  },
  computed:{
     boards(){
         return this.$store.getters.boards
     }
  }
}
</script>

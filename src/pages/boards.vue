<template>
  <section class="boards-page">
     <h1 class="title">Choose Your Board</h1>
     <div class="container">
      <ul class="boards-list">
         <li class="boards-preview" v-for="board in boards" :key="board._id"
        >
           <img class="rope" src="@/assets/rope.png" alt="">
           <section class="background" @click="openBoard(board._id)"
           :style="{backgroundColor:board.style['background-color'],
           backgroundImage:board.style['background-image']}">
               <div class="title-board-bg">{{board.title}}</div>
               <div class="title-board">{{board.title}}</div>
               </section>
               <img class="clothespin-right" src="@/assets/Clothespin.png" alt="">
               <img class="clothespin-left" src="@/assets/Clothespin.png" alt="">
         </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  async created() {
     if(!this.boards){
         try {
            await this.$store.dispatch({ type: "loadBoards" });
         } catch (err) {
            console.log("ERROR cannot load boards");
         }
     }
  },
  methods:{
     openBoard(boardId){
        this.$router.push(`/b/${boardId}`);
     }
  },
  computed:{
     boards(){
         return this.$store.getters.boards
     }
  }
}
</script>

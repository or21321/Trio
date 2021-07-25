<template>
  <section class="container-dashboard" @click="closeDashboard">
     <div @click.stop class="dashboard">
        <header class="dashboard-header">
            <span class="close material-icons-outlined" 
            @click="closeDashboard">close</span>
        </header>
         <main class="dashboard-main">
            <div class="statistics">
               <article class="total-cards">
                  <span class="material-icons-outlined dashboard-icon icon-total-cards">text_snippet</span>
                 <div class="info">
                    <span class="count"> {{titalCards}}</span>
                    <span class="title"> Total cards </span>
                    </div>
               </article>
               <article class="unassigned-cards">
                  <span class="material-icons-outlined dashboard-icon icon-unassigned-cards">
                     help_outline</span>
                 <div class="info">
                    <span class="count"> {{unassignedCards}}</span>
                    <span class="title"> Unassigned Cards </span>
                    </div>
               </article>
               <article class="members">
                  <span class="material-icons-outlined dashboard-icon icon-member">person_outline</span>
                 <div class="info">
                    <span class="count"> {{board.members.length}}</span>
                    <span class="title"> Members </span>
                    </div>
               </article>
               <article class="activities">
                  <span class="material-icons-outlined dashboard-icon icon-activities">task_alt</span>
                 <div class="info">
                    <span class="count"> {{board.activities.length}}</span>
                    <span class="title"> Activities </span>
                    </div>
               </article>
            </div>
            <div class="charts">
               <div class="chart-container">
                  <div class="title-chart"> Cards per list</div>
               <chart-card-per-group :board="board" class="card-per-group"/>
               </div>
                <div class="chart-container">
                  <div class="title-chart"> Cards per Member</div>
               <chart-card-per-member :board="board" class="card-per-member"/>
               </div>
            </div>
         </main>
      </div>
  </section>
</template>

<script>
import chartCardPerGroup from './chart-card-per-group.vue'
import chartCardPerMember from './chart-card-per-member.vue'
export default {
   props:{
      board:{
        type:Object,
        required:true
      }
   },
   components:{
      chartCardPerGroup,
      chartCardPerMember
   },
   methods:{
      closeDashboard(){
         this.$emit('closeDashboard')
      }
   },
   computed:{
      titalCards(){
        return this.board.groups.reduce((acc,group) => {
          acc += group.cards.reduce((acc1) =>{
              return ++acc1;
           },0)
           return acc;
        },0)
      },
      unassignedCards(){
        return this.board.groups.reduce((acc,group) => {
          acc += group.cards.reduce((acc1,card) =>{
             if(!card.members.length) acc1++
              return acc1;
           },0)
           return acc;
        },0)
      }
   }
}
</script>

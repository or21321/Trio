<template>
  <section class="card-cover-edit">
    <div>
    <span>{{action.name}}</span>
      <span class="close material-icons close-popup-btn" @click.stop="close">close</span>
    </div>
    <main>
       <section class="size">
          <h4 class="title">SIZE</h4>
          <section class="boards"> 
            <button @click="setSize('half')" ref="halfBtn" :class="outlineHalfButtonClass">
               <div class="board-half">
                  <div class="bgc" :style="{backgroundColor:getBgc}">
                  </div>
                  <div class="lines">
                     <div class="line line1" :style="{backgroundColor:getColor}"></div>
                     <div class="line line2" :style="{backgroundColor:getColor}"></div>
                     <div class="line line3" :style="{backgroundColor:getColor}"></div>
                     <div class="line line4" :style="{backgroundColor:getColor}"></div>
                  </div>
                  <div class="circle" :style="{backgroundColor:getColor}"></div>
                  </div> 
            </button>
            <button @click="setSize('full')" ref="fullBtn" :class="outlineFullButtonClass">
               <div class="board-full"
               :style="{backgroundColor: getBgc}">
                   <div class="lines">
                     <div class="line line1" :style="{backgroundColor:getColorForFull}"></div>
                     <div class="line line2" :style="{backgroundColor:getColorForFull}"></div>
                  </div>
               </div>
             </button>
          </section>
       </section>
          <button class="remove-cover" v-if="this.cardToEdit.cover.color"
          @click="removeCover">Remove cover</button>
       <section class="colors-container">
          <h4 class="title">COLORS</h4>
          <section class="colors">
            <button class="color" v-for="(color,idx) in colors" :key="idx"
            :style="{backgroundColor:color}" @click.stop="setColor(color)">
            </button>
          </section>
       </section>
    </main>
  </section>
</template>

<script>
export default {   
    props: {    
        action: {   
            type: Object,
            required: true
        },
        card: { 
            type: Object,
            required: true
        }
    } ,
    data()  {   
    return {
        cardToEdit: JSON.parse(JSON.stringify(this.card)),
        colors:['#7BC86C','#F5DD29','#FFAF3F','#EF7564','#CD8DE5','#5BA4CF','#29CCE5',
        '#6DECA9','#FF8ED4','#9e9e9e'],
        isRemove:false
    }
    },
    created() {  
      this.cardToEdit = JSON.parse(JSON.stringify(this.card))
    },
    methods: {  
        updateCard() {  
            this.$emit('updateCard', this.cardToEdit ,true)
        },
         close() {
      this.$emit("close");
      },
      setColor(color){
        this.cardToEdit.cover.color = color;
        if(!this.cardToEdit.cover.type) this.cardToEdit.cover.type = 'half'
        this.updateCard();
      },
      setSize(type){
         if(!this.cardToEdit.cover.color && !this.isRemove) return
        this.cardToEdit.cover.type = type;
        this.updateCard();
      },
      removeCover(){
         this.isRemove = true
         this.setColor('');
         this.setSize('');
         this.$refs.halfBtn.classList.remove('out-line')
         this.$refs.fullBtn.classList.remove('out-line')
           this.isRemove = false
      }
    },
    computed:{
       getBgc(){
          return (this.cardToEdit.cover.color)? this.cardToEdit.cover.color :  '#5e6c8454'
       },
       getColor(){
          return (this.cardToEdit.cover.color)? 'gray' :  '#5e6c8454'
       },
       getColorForFull(){
          return (this.cardToEdit.cover.color)? 'gray' :  'white'
       },
       outlineFullButtonClass(){
          return{'out-line': this.cardToEdit.cover.type === 'full'}
       },
       outlineHalfButtonClass(){
          return {'out-line': this.cardToEdit.cover.type === 'half'}
       },
    }

}   
</script>

<template>
  <section class="card-cover-edit">
    <div>
    <span>{{action.name}}</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <main>
       <section class="size">
          <h4 class="title">SIZE</h4>
          <section class="boards"> 
            <button @click="setSize('half')" :class="outlineHalfButtonClass">
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
            <button @click="setSize('full')" :class="outlineFullButtonClass">
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
          @click="setColor(''),setSize('')">Remove cover</button>
       <section class="colors-container">
          <h4 class="title">COLORS</h4>
          <section class="colors">
            <button class="color" v-for="(color,idx) in colors" :key="idx"
            :style="{backgroundColor:color}" @click="setColor(color)">
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
        '#6DECA9','#FF8ED4','#172B4D']
    }
    },
    created() {  
      this.cardToEdit = JSON.parse(JSON.stringify(this.card))
      console.log('this.cardToEdit', this.cardToEdit)
    },
   //  watch: {
   //     cardToEdit :{
   //        deep:true,
   //        handler(){
   //           console.log('yesssssssssssssssssssssssss');
   //        }
   //     }
   //  },
    methods: {  
        updateCard() {  
            this.$emit('updateCard', this.cardToEdit)
        },
         close() {
      this.$emit("close");
      },
      setColor(color){
        this.cardToEdit.cover.color = color;
        if(!this.cardToEdit.cover.type) this.cardToEdit.cover.type = 'half'
        console.log('******************',this.cardToEdit.cover.color);
        this.updateCard();
      },
      setSize(type){
        this.cardToEdit.cover.type = type;
        this.updateCard();
      },
    },
    computed:{
       getBgc(){
          console.log('******************',this.cardToEdit.cover);
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

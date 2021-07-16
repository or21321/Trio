<template>
  <div class="board-compose-container" @click="closeCompose">
    <div class="board-compose">
      <div class="board-compose-preview" :style="{'backgroundColor':selectColor}">
        <button @click="close" class="close-compose">X</button>
        <el-input placeholder="Add board title" v-model="board.title"></el-input>
        <el-button @click="createBoard"  type="primary" class="compose-btn">Create board</el-button>
        <el-button @click="renderColors" type="primary" class="chage-colors">Change Colors</el-button>
       </div>
      <div class="board-compose-bcgs">
        <span v-for="(color, idx) in colors" :key="idx" 
        :style="{'backgroundColor':color}" @click="setBcg(color)"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {boardService} from '../services/board.service.js'
import {utilService} from '../services/util.service.js'
export default {
 data(){
    return{
       board:boardService.getEmptyBoard(),
       colors:[],
       selectColor: "#868686"
    }
 },
 created(){
     this.renderColors()
 },
  methods: {
     renderColors(){
        this.colors = [];
      for(var i = 0; i < 9; i++){
         this.colors.push(utilService.getRandomColor())
      }
     },
    closeCompose(ev) {
      if (ev.target.className === "board-compose-container") {
        this.$emit("closeCompose");
      }
    },
    createBoard() {
       this.board.style = {'background-color':this.selectColor}
       this.$emit("addBoard", this.board);
    },
    close(){
        this.$emit("closeCompose");
    },
    setBcg(color){
       this.selectColor = color;
       this.board.style = {'background-color':color}
    }
  },
  destroyed(){
     this.colors = []
  }
};
</script>


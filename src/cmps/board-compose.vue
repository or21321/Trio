<template>
  <div class="board-compose-container" @click="closeCompose">
    <div class="board-compose">
      <div class="board-compose-preview" :style="{backgroundColor:selectColor,
      backgroundImage: 'url(' + selectImg + ')'}">
        <button @click="close" class="close-compose">X</button>
        <el-input placeholder="Add board title" v-model="board.title"></el-input>
        <el-button @click="createBoard"  type="primary" class="compose-btn">Create board</el-button>
        <el-button @click="renderColors" type="primary" class="chage-colors">Change Colors</el-button>
       </div>
      <section class="backgrounds">
         <div class="board-compose-imgs">
            <span v-for="(img, idx) in imgs" :key="idx" 
            :style="{backgroundImage: `url(${img})` }" @click="setimg(img)"></span>
         </div>
         <div class="board-compose-bcgs">
            <span v-for="(color, idx) in colors" :key="idx" 
            :style="{backgroundColor :color}" @click="setBcg(color)"></span>
         </div>
      </section>
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
       imgs:['https://www.bhmpics.com/download/antarctica_mountains_sunset_ocean_snow-1920x1080.jpg',
       'https://images-na.ssl-images-amazon.com/images/S/sgp-catalog-images/region_US/u8lua-4AD76J88AJT-Full-Image_GalleryBackground-en-US-1585673473334._RI_.jpg',
       'https://wallpaperaccess.com/full/1146927.jpg',
       'https://wallpaperaccess.com/full/109672.jpg',
       ],
       selectImg: "https://wallpaperaccess.com/full/109672.jpg",
       selectColor: ""
  
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
       this.board.style = {'background-color':this.selectColor,
       'background-image': `url(${this.selectImg})`}
       this.$emit("addBoard", this.board);
    },
    close(){
        this.$emit("closeCompose");
    },
    setBcg(color){
       this.selectImg='';
       this.selectColor = color;
       this.board.style = {'background-color':color}
    },
    setimg(img){
       this.selectColor='';
       this.selectImg = img;
       this.board.style = {'background-image:':`url(${img})`}
    }
  },
  destroyed(){
     this.colors = [];
  }
};
</script>


<template>
  <div class="board-compose-container" @click="closeCompose">
    <div class="board-compose">
        <div class="board-compose-preview" @click.stop contenteditable="">preview</div>
        <!-- <div class="board-compose-bcgs">bcgs</div> -->
        <div class="board-compose-bcgs">
            <span v-for="(bcg, idx) in 9" :key="idx"></span>
        </div>
    <button @click="add" class="compose-btn">Create board</button>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    console.log("board compose created");
  },
  methods: {
    closeCompose() {
        console.log('hy');
        this.$emit('closeCompose')
    },
    add() { 
        console.log('add()');
    }
  },
};
</script>


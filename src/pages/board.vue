<template>
  <div class="board">
    <h2>Hey</h2>
      </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    };
  },
  created() {
    console.log("board created, boardId:", this.boardId);
  },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
  },
  methods: {
       
  },
};
</script>


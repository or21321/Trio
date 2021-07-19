<template>
  <section  class="side-menu-popup">
    <div class="card-edit-header">
      <span>Menu</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <div class="card-edit-main popup-layout-1">
      <ul>
        <li>
          <span :style="background" class="background icon"></span>
          <span class="option">Change background</span>
        </li>
        <li>
          <span class="material-icons-outlined icon">search</span>
          <span class="option">Search cards</span>
        </li>
        <li>
          <span class="material-icons-outlined icon">delete_outline</span>
          <span class="option" @click="remove">Delete Board</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    background() {
      if (this.board.style['background-color']) 
        return { "background-color": this.board.style['background-color'] };
      else 
        return { "background-image": this.board.style['background-image'] };
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    remove(){
      console.log('deleteing board id:', this.board._id)
      this.close()
      //TODO: delete from recent boards
      this.$emit("removeBoard", this.board._id)
    }
  },
};
</script>

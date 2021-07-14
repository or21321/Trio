<template>
  <div class="board">
    <h2>Hey</h2>
    <button @click="toggle">Click</button>
    <cardEditPopup v-if="isOn">
      <h2 slot="header">Hey</h2>
      <p slot="main">main1</p>
    </cardEditPopup>
    <cardEditPopup v-if="">
      <div slot="header">
      <button>X</button>
      </div>
    <labels-cmp></labels-cmp>      
      <!-- <labels-optnios slot="main"></labels-optnios> --> -->
    </cardEditPopup>
  </div>
</template>

<script>
import cardEditPopup from "@/cmps/card-edit-popup.vue";

export default {
  components: {
    cardEditPopup,
  },
  data() {
    return {
      isOn: false

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
    toggle() {  
      this.isOn = !this.isOn
    }
  },
};
</script>


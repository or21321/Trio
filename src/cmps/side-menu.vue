<template>
  <section class="side-menu-popup">
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

      <ul>
        <li>
          <span class="material-icons-outlined icon">format_list_bulleted</span>
          <span class="option">Activity</span>
        </li>
        <li v-for="activity in activities" :key="activity.id">
          <avatar
            :size="32"
            :username="activity.byMember.fullname"
            :src="activity.byMember.imgUrl"
          />
          <div class="info">
            <p class="option">
              <span class="activity-user">{{ activity.byMember.fullname }} </span>
              <span class="activity-txt">{{ activity.txt }}</span>
            </p>
            <span class="activity-time">{{
              activity.createdAt | moment("from", "now")
            }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import avatar from "vue-avatar";

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    background() {
      if (this.board.style["background-color"])
        return { "background-color": this.board.style["background-color"] };
      else return { "background-image": this.board.style["background-image"] };
    },
    activities() {
      return this.board.activities;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    remove() {
      this.close();
      this.$emit("removeBoard", this.board._id);
    },
  },
  components: {
    avatar,
  },
};
</script>

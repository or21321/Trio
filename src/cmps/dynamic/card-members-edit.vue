<template>
  <section>
    <!-- <div class="card-members-edit"> -->
    <div class="card-edit-header">
      <span>{{ action.name }}</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <div class="card-edit-main">
      <input type="text" placeholder="Search members" />
      <span v-for="user in users" :key="user._id"> {{ user.fullname }}</span>
    </div>
    <!-- <div class="card-members"> -->
    <!-- </div> -->
    <!-- <div class="edit-content-holder"> -->
    <!-- </div> -->
    <!-- </div> -->
  </section>
</template>

<script>
export default {
  props: {
    action: {
      type: Object,
      required: true,
    },
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cardToEdit: null,
    };
  },
  created() {
    this.$store.dispatch({ type: "loadUsers" });
    console.log("cardMembersEdit creadted!");
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
    console.log("cardToEdit after deep copy", this.cardToEdit);
    console.log("users from store", this.users);
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
  },
  methods: {
    updateTask() {
      this.$emit("updateTask", this.card);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

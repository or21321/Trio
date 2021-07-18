<template>
  <section class="user-menu-popup">
    <div class="card-edit-header">
      <span>Account</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <div class="card-edit-main popup-layout-1">
      <div class="account-info">
        <avatar :size="40" :username="user.fullname" :src="user.imgUrl" />
        <div class="account-details">
          <span>{{ user.fullname }}</span>
          <span class="email"> {{ user.email }}</span>
        </div>
      </div>
      <div class="logout" @click="logout">
        Log out
      </div>
    </div>
  </section>
</template>

<script>
import avatar from "vue-avatar";
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cardToEdit: null,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    logout(){
      this.$emit("logout")
    }
  },
  components: {
    avatar,
  },
};
</script>
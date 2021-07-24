<template>
  <div class="login-signup">
     <img class="wave" src="@/assets/wave.svg" alt="">
     <section class="header-waves">
      <div class="logo">
         <span class="material-icons-outlined logo-icon">space_dashboard</span>Trio
      </div>
      <nav class="homepage-nav">
         <router-link to='/' class="login">Home</router-link>
         <span> | </span>
         <router-link to='/login' class="signup">Log in</router-link>
      </nav>
    </section>
    <div class="main-container">
        <p>Sign up for your account</p>
        <form @submit.prevent="signup">
            <input type="text" name="fullname" v-model="user.fullname" placeholder="Enter full name" autocomplete="off" required />
            <input type="text" name="username" v-model="user.username" placeholder="Enter username" autocomplete="off" required />
            <input type="email" name="email" v-model="user.email"  placeholder="Enter email" />
            <input type="password" name="password" v-model="user.password" placeholder="Enter password" required />
        <!-- imgUrl: 'http://some-img.jpg', // need to add an avatar img -->
            <div class="avatar">
              <div v-if="isLoading">
                Loading image...
              </div>
              <div v-else class="avatar-img">
                <label v-if="!isLoaded" for="select-avatar">Avatar image: 
                  <span class="material-icons-outlined">cloud_upload</span>
                  <input  id="select-avatar" type="file" @change="onUploadImg" accept="image/png, image/gif, image/jpeg" hidden/>
                </label>
                <img v-else :src="user.imgUrl" class="avatar-img-display avatar">
              </div>
            </div>
            <button>Sign up</button>
        </form>
        <router-link class="btn-signup" to="/login">Already have an account? Log in</router-link>
    </div>
  </div>
</template>

<script>
import { uploadImg } from "../services/img-upload.service.js";
export default {
  data(){
    return {
      user: {
        fullname: null,
        username: null,
        email: null,
        password: null,
        imgUrl: '',
        mentions: []
      },
      isLoading: false,
      isLoaded: false
    }
  },
  methods: {
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.user.imgUrl = res.url
        this.isLoaded = true
      } catch (err) {
        console.log("cannot upload image", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async signup() {
      await this.$store.dispatch({ type: "signup", userCred: this.user });
      // TODO: Add memeber to general shared board/s
      this.$router.push(`/b/${this.$store.getters.boards[0]._id}`);
    },
  },
};
</script>
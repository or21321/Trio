<template>
  <section class="side-menu-popup">
    <div class="card-edit-header">
      <transition name="slide-right">
        <span
          @click="setDeeperOption('')"
          v-if="deeperOption !== ''"
          class="material-icons-outlined back"
          >arrow_back_ios</span
        >
      </transition>
      <span>{{ title }}</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>

    <div v-if="deeperOption === ''" class="card-edit-main popup-layout-1">
      <ul>
        <li @click="setDeeperOption('changeBackground')">
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
              <span class="activity-user"
                >{{ activity.byMember.fullname }}
              </span>
              <span class="activity-txt">{{ activity.txt }}</span>
            </p>
            <span class="activity-time">{{
              activity.createdAt | moment("from", "now")
            }}</span>
          </div>
        </li>
      </ul>
    </div>

    <transition name="slide-from-right">
      <div
        v-if="deeperOption === 'changeBackground'"
        class="popup-layout-1 change-background"
      >
        <ul>
          <div @click="setDeeperOption('photos')">
            <img
              src="https://a.trellocdn.com/prgb/dist/images/photos-thumbnail@3x.8f9c1323c9c16601a9a4.jpg"
              alt=""
            />
            <p>Photos</p>
          </div>
          <div @click="setDeeperOption('colors')">
            <img
              src="https://a.trellocdn.com/prgb/dist/images/colors@2x.ec32a2ed8dd8198b8ef0.jpg"
              alt=""
            />
            <p>Colors</p>
          </div>
        </ul>
      </div>
    </transition>

    <transition name="slide-from-right">
      <div v-if="deeperOption === 'colors'" class="colors">
        <ul>
          <li
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="color"
            @click="changeBackground(color, '')"
          ></li>
        </ul>
      </div>
    </transition>

    <transition name="slide-from-right">
      <div v-if="deeperOption === 'photos'" class="photos">
        <input
          type="text"
          v-model="filterBy"
          @input="getPhotos"
          placeholder="Search"
        />
        <ul v-if="photosUrls.length">
          <li
            v-for="photoUrl in photosUrls"
            :key="photoUrl"
            class="photo"
            @click="changeBackground('', photoUrl)"
            :style="{ backgroundImage: `url(${photoUrl})` }"
          >
            <!-- <img :src="photoUrl" alt="" /> -->
          </li>
        </ul>
      </div>
    </transition>
  </section>
</template>

<script>
import avatar from "vue-avatar";
import { unsplashService } from "@/services/unsplash.service";
// import { createApi } from "unsplash-js";
// const unsplash = createApi({
//   accessKey: "FtAiz5o_uM9Ab_oizQTJSEHWEqQaBm6ygimUsEWNKlc",
//   // `fetch` options to be sent with every request
//   headers: { "X-Custom-Header": "foo" },
// });
export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deeperOption: "",
      filterBy: "",
      photosUrls: [],
      colors: [
        "#0079bf",
        "#d29034",
        "#519839",
        "#b04632",
        "#89609e",
        "#cd5a91",
        "#4bbf6b",
        "#00aecc",
        "#838c91",
      ],
      photos: null,
    };
  },
  created() {
    // this.getPhotos();
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
    title() {
      var title = "";
      switch (this.deeperOption) {
        case "changeBackground":
          title = "Change background";
          break;
        case "searchCards":
          title = "Search cards";
          break;
        case "colors":
          title = "Colors";
          break;
        case "photos":
          title = "Photos by unsplash";
          break;
        case "":
          title = "Menu";
          break;
      }
      return title;
    },
  },
  methods: {
    // async getPhotos() {
    // try {
    // const photos = await unsplash.photos.get(
    // { photoId: "", count: 10 }
    // `fetch` options to be sent only with _this_ request
    // );
    // for (var i = 0; i < photos.length - 1; i++) {
    //   this.photos.push(photos.response[i].links.html);
    // }
    // this.photos = photos.response;
    // const photos = await unsplash.collections.get({ collectionId: '2533618', page: 1, perPage: 20, count:5 })
    //     console.log("photos", photos);
    //   } catch (err) {
    //     console.log("Had problem getting photos from unsplash", err);
    //   }
    // },
    async getPhotos(filterBy) {
      try {
        console.log("filterBy", this.flterBy);
        const photos = await unsplashService.query(this.filterBy);
        console.log("photos", photos);
        this.photosUrls = photos.map((photo) => photo.urls.regular);
        console.log("photosUrls", this.photosUrls);
      } catch (err) {
        console.log("Had a problem getting photos", err);
      }
    },
    setDeeperOption(option) {
      console.log(option);
      this.deeperOption = option;
    },
    close() {
      this.$emit("close");
    },
    remove() {
      this.close();
      this.$emit("removeBoard", this.board._id);
    },
    changeBackground(color, photoUrl) {
      const style = {
        "background-color": color,
        "background-image": `url(${photoUrl})`,
      };
      console.log("style", style);
      this.$emit("setBackground", style);
    },
  },
  components: {
    avatar,
  },
};
</script>

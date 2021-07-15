<template>
  <section class="card-details" @click="closeCardDetails">
    <main class="card-container" @click.stop="" v-if="card">
      <header class="header">
        <span class="icon-title material-icons-outlined">title</span>
        <section class="titles">
          <input v-model="card.title" class="main-title" @change="saveCard" />
          <h4 class="sub-title">in list {{ groupName }}</h4>
        </section>
        <span class="close material-icons" @click="closeCardDetails">
          close
        </span>
      </header>
      <section class="main">
        <section class="description grid-details">
          <span class="material-icons-outlined">subject</span>
          <h1 class="title-description">Description</h1>
          <div class="text-container">
          <contenteditable
            class="description-text"
            tag="div"
            :contenteditable="true"
            v-model="card.description"
            placeholder="Add a more detailed description..."
            :noNL="false"
            :noHTML="true"
            @input="saveCard"
          />
          <el-button type="primary">save</el-button>
          <button class="btn-close"> X</button>

          </div>
        </section>
        <section
          class="attachments grid-details"
          v-if="card.attachments.length"
        >
          <span class="attachments-icon material-icons-outlined"
            >attachments</span
          >
          <h1 class="title-attachments">attachments</h1>
          <div class="imgs-container">
            <article class="img-container" v-for="(img, idx) in card.attachments" :key="idx">
              <img :src="img.url"/>
               <p>{{ img.creatAt | moment("dddd, MMM Do YYYY") }}</p>
            </article>
            </div>
        </section>
      </section>
      <nav class="nav">
        <h3 class="title">Add to card</h3>
        <button @click="setPopup('Members')">
          <span class="material-icons-outlined">person_add</span>
          <span> Members </span>
        </button>
        <button @click="setPopup('Labels')">
          <span class="material-icons-outlined">label</span>
          <span> Labels </span>
        </button>
        <button @click="setPopup('Checklist')">
          <span class="material-icons-outlined">check_box</span>
          <span> Checklist </span>
        </button>
        <button @click="setPopup('Dates')">
          <span class="material-icons-outlined">watch_later</span>
          <span> Dates </span>
        </button>
        <label for="input-file">
          <span class="attachments-icon material-icons-outlined"
            >attachment</span
          >
          <span> Attachment </span>
        </label>
        <input
          id="input-file"
          type="file"
          @change="onUploadImg"
          accept="image/png, image/gif, image/jpeg"
          hidden
        />

        <button @click="setPopup('Cover')">
          <span class="material-icons-outlined">wallpaper</span>
          <span> Cover </span>
        </button>
      </nav>
    </main>
  </section>
</template>

<script>
import { uploadImg } from "../services/img-upload.service.js";
export default {
  data() {
    return {
      card: null,
      boardId: this.$route.params.boardId,
      groupId: this.$route.params.groupId,
      cardId: this.$route.params.cardId,
      groupName: null,
      isLoading: false,
      type:null,
      isPopupShow:false
    };
  },
  watch: {
    "$route.params.cardId": {
      immediate: true,
      async handler() {
        try {
          this.card = await this.$store.dispatch({
            type: "getCardById",
            cardId: this.cardId,
            groupId: this.groupId,
            boardId: this.boardId,
          });
        } catch (err) {
          console.log("cannot get card", err);
          throw err;
        }
      },
    },
  },
  async created() {
    try {
      const group = await this.$store.dispatch({
        type: "getGroupById",
        groupId: this.groupId,
        boardId: this.boardId,
      });
      this.groupName = group.title;
    } catch (err) {
      console.log("cannot get group", err);
      throw err;
    }
  },
  methods: {
    enterPressed() {
      console.log("yes!");
    },
    closeCardDetails() {
      this.$router.push(`/b/${this.boardId}`);
    },
    setPopup(value) {
       this.isPopupShow = true
       this.type = value;
    },
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.card.attachments.push({ url: res.url, creatAt: Date.now() });
        this.card = await this.$store.dispatch({
          type: "saveCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async saveCard() {
      try {
        this.card = await this.$store.dispatch({
          type: "saveCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      }
    },
    setDescription(ev) {
      console.log("ev.data", ev.data);
      if (ev.data) this.card.description += ev.data;
      else {
        this.card.description = this.card.description.substring(
          0,
          this.card.description.length - 1
        );
      }
      //   console.log('description', this.card.description)
    },
  },
  computed: {},
};
</script>

<style>
</style>